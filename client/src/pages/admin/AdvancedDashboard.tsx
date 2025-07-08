import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  TrendingUp, 
  Users, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  BarChart3,
  Shield,
  Settings,
  Database,
  RefreshCw,
  Eye,
  Filter
} from "lucide-react";

interface ContributionStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  byPriority: Record<string, number>;
  byType: Record<string, number>;
}

interface SystemHealth {
  activeUsers: number;
  todayContributions: number;
  pendingContributions: number;
  averageResponseTime: number;
}

interface UserActivity {
  contributionsCount: number;
  ratingsCount: number;
  lastActivity: Date | null;
}

interface Contribution {
  id: number;
  type: string;
  status: string;
  priority: string;
  createdAt: Date;
  userId: string;
  productId?: number;
  storeId?: number;
  data: any;
  adminNotes?: string;
}

export default function AdvancedDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const queryClient = useQueryClient();

  // Fetch contribution statistics
  const { data: contributionStats, isLoading: statsLoading } = useQuery<ContributionStats>({
    queryKey: ['/api/admin/contributions/stats'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch system health
  const { data: systemHealth, isLoading: healthLoading } = useQuery<SystemHealth>({
    queryKey: ['/api/admin/system/health'],
    refetchInterval: 30000,
  });

  // Fetch contributions by status
  const { data: pendingContributions, isLoading: pendingLoading } = useQuery<Contribution[]>({
    queryKey: ['/api/admin/contributions/status', 'pending'],
    enabled: selectedStatus === 'all' || selectedStatus === 'pending',
  });

  // Bulk update contributions mutation
  const bulkUpdateMutation = useMutation({
    mutationFn: async ({ ids, status, reviewerId }: { ids: number[]; status: string; reviewerId?: string }) => {
      return apiRequest('/api/admin/contributions/bulk-update', {
        method: 'POST',
        body: JSON.stringify({ ids, status, reviewerId }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contributions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contributions/stats'] });
    },
  });

  // Update priority mutation
  const updatePriorityMutation = useMutation({
    mutationFn: async ({ id, priority }: { id: number; priority: string }) => {
      return apiRequest(`/api/admin/contributions/${id}/priority`, {
        method: 'POST',
        body: JSON.stringify({ priority }),
        headers: { 'Content-Type': 'application/json' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/contributions'] });
    },
  });

  const handleBulkApprove = (ids: number[]) => {
    bulkUpdateMutation.mutate({ ids, status: 'approved' });
  };

  const handleBulkReject = (ids: number[]) => {
    bulkUpdateMutation.mutate({ ids, status: 'rejected' });
  };

  const handlePriorityChange = (id: number, priority: string) => {
    updatePriorityMutation.mutate({ id, priority });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'rejected':
        return 'bg-red-500';
      case 'pending':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (statsLoading || healthLoading) {
    return (
      <div className="container mx-auto p-4 space-y-6">
        <PageHeader 
          title="Advanced Dashboard" 
          icon={<BarChart3 className="w-6 h-6" />}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <PageHeader 
        title="Advanced Dashboard" 
        icon={<BarChart3 className="w-6 h-6" />}
      />

      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Active Users</CardTitle>
            <Users className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemHealth?.activeUsers || 0}</div>
            <p className="text-xs text-gray-400">Today</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Today's Contributions</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemHealth?.todayContributions || 0}</div>
            <p className="text-xs text-gray-400">New submissions</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemHealth?.pendingContributions || 0}</div>
            <p className="text-xs text-gray-400">Awaiting moderation</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{systemHealth?.averageResponseTime || 0}s</div>
            <p className="text-xs text-gray-400">Average</p>
          </CardContent>
        </Card>
      </div>

      {/* Contribution Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Contribution Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{contributionStats?.approved || 0}</div>
                <div className="text-sm text-gray-400">Approved</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{contributionStats?.pending || 0}</div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{contributionStats?.rejected || 0}</div>
                <div className="text-sm text-gray-400">Rejected</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Approval Rate</span>
                <span className="text-white">
                  {contributionStats?.total ? 
                    Math.round((contributionStats.approved / contributionStats.total) * 100) : 0
                  }%
                </span>
              </div>
              <Progress 
                value={contributionStats?.total ? (contributionStats.approved / contributionStats.total) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {contributionStats?.byPriority && Object.entries(contributionStats.byPriority).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`}></div>
                    <span className="text-gray-300 capitalize">{priority}</span>
                  </div>
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Contribution Management */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Database className="w-5 h-5" />
            Advanced Contribution Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-700">
              <TabsTrigger value="pending" className="text-gray-300">Pending</TabsTrigger>
              <TabsTrigger value="approved" className="text-gray-300">Approved</TabsTrigger>
              <TabsTrigger value="rejected" className="text-gray-300">Rejected</TabsTrigger>
              <TabsTrigger value="analytics" className="text-gray-300">Analytics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending" className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  onClick={() => pendingContributions && handleBulkApprove(pendingContributions.map(c => c.id))}
                  disabled={!pendingContributions?.length || bulkUpdateMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve All
                </Button>
                <Button 
                  onClick={() => pendingContributions && handleBulkReject(pendingContributions.map(c => c.id))}
                  disabled={!pendingContributions?.length || bulkUpdateMutation.isPending}
                  variant="destructive"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Reject All
                </Button>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-3">
                {pendingLoading ? (
                  <div className="text-center text-gray-400">Loading contributions...</div>
                ) : pendingContributions?.length === 0 ? (
                  <div className="text-center text-gray-400">No pending contributions</div>
                ) : (
                  pendingContributions?.map((contribution) => (
                    <div key={contribution.id} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={`${getPriorityColor(contribution.priority)} text-white`}>
                            {contribution.priority}
                          </Badge>
                          <Badge variant="outline" className="text-gray-300 border-gray-600">
                            {contribution.type}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(contribution.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="text-gray-300 mb-3">
                        {contribution.type === 'price_update' ? (
                          <div>Price update for product #{contribution.productId}</div>
                        ) : contribution.type === 'store_info' ? (
                          <div>Store information update #{contribution.storeId}</div>
                        ) : (
                          <div>Contribution #{contribution.id}</div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button 
                          onClick={() => handleBulkApprove([contribution.id])}
                          disabled={bulkUpdateMutation.isPending}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleBulkReject([contribution.id])}
                          disabled={bulkUpdateMutation.isPending}
                          size="sm"
                          variant="destructive"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                        <Button 
                          onClick={() => handlePriorityChange(contribution.id, contribution.priority === 'high' ? 'medium' : 'high')}
                          disabled={updatePriorityMutation.isPending}
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Priority
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="text-center text-gray-400">
                Advanced analytics and reporting features coming soon...
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}