// Azure parameters

@description('The name of Nexus Kubernetes cluster')
param kubernetesClusterName string

@description('The Azure region where the cluster is to be deployed')
param location string = resourceGroup().location

@description('The custom location of the Nexus instance')
param extendedLocation string

@description('The metadata tags to be associated with the cluster resource')
param tags object = {}

@description('The username for the administrative account on the cluster')
param adminUsername string = 'azureuser'

@description('The object IDs of Azure Active Directory (AAD) groups that will have administrative access to the cluster')
param adminGroupObjectIds array = []

// Networking Parameters

@description('The Azure Resource Manager (ARM) id of the network to be used as the Container Networking Interface (CNI) network')
param cniNetworkId string

@description('The ARM id of the network to be used for cloud services network')
param cloudServicesNetworkId string

@description('The CIDR blocks used for Nexus Kubernetes PODs in the cluster')
param podCidrs array = ['10.244.0.0/16']

@description('The CIDR blocks used for k8s service in the cluster')
param serviceCidrs array = ['10.96.0.0/16']

@description('The IP address of the DNS service in the cluster')
param dnsServiceIp string = '10.96.0.10'

@description('The Layer 2 networks associated with the initial agent pool')
param agentPoolL2Networks array = []
// {
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The Layer 3 networks associated with the initial agent pool')
param agentPoolL3Networks array = []
// {
//   ipamEnabled: 'True/False'
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The trunked networks associated with the initial agent pool')
param agentPoolTrunkedNetworks array = []
// {
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The Layer 2 networks associated with the cluster')
param l2Networks array = []
// {
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The Layer 3 networks associated with the cluster')
param l3Networks array = []
// {
//   ipamEnabled: 'True/False'
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The trunked networks associated with the cluster')
param trunkedNetworks array = []
// {
//   networkId: 'string'
//   pluginType: 'SRIOV|DPDK|OSDevice|MACVLAN|IPVLAN'
// }

@description('The LoadBalancer IP address pools associated with the cluster')
param ipAddressPools array = []
// {
//   addresses: [
//     'string'
//   ]
//   autoAssign: 'True/False'
//   name: 'string'
//   onlyUseHostIps: 'True/False'
// }

// Cluster Configuration Parameters

@description('The version of Kubernetes to be used in the Nexus Kubernetes cluster')
param kubernetesVersion string = 'v1.24.9'

@description('The number of control plane nodes to be deployed in the cluster')
param controlPlaneCount int = 1

@description('The zones/racks used for placement of the control plane nodes')
param controlPlaneZones array = []
// "string" Example: ["1", "2", "3"]

@description('The zones/racks used for placement of the agent pool nodes')
param agentPoolZones array = []
// "string" Example: ["1", "2", "3"]

@description('The size of the control plane nodes')
param controlPlaneVmSkuName string = 'NC_G6_28_v1'

@description('The number of worker nodes to be deployed in the initial agent pool')
param systemPoolNodeCount int = 1

@description('The size of the worker nodes')
param workerVmSkuName string = 'NC_P10_56_v1'

@description('The configurations for the initial agent pool')
param initialPoolAgentOptions object = {}
// {
//   "hugepagesCount": integer,
//   "hugepagesSize": "2M/1G"
// }

@description('The SSH public key that will be associated with the "azureuser" user for secure remote login')
param sshPublicKey string = ''

@description('The labels to assign to the nodes in the cluster for identification and organization')
param labels array = []
// {
//   key: 'string'
//   value: 'string'
// }
@description('The taints to apply to the nodes in the cluster to restrict which pods can be scheduled on them')
param taints array = []
// {
//   key: 'string'
//   value: 'string:NoSchedule|PreferNoSchedule|NoExecute'
// }

resource kubernetescluster 'Microsoft.NetworkCloud/kubernetesClusters@2023-07-01' = {
  name: kubernetesClusterName
  location: location
  tags: tags
  extendedLocation: {
    name: extendedLocation
    type: 'CustomLocation'
  }
  properties: {
    kubernetesVersion: kubernetesVersion
    managedResourceGroupConfiguration: {
      name: '${uniqueString(resourceGroup().name)}-${kubernetesClusterName}'
      location: location
    }
    aadConfiguration: {
      adminGroupObjectIds: adminGroupObjectIds
    }
    administratorConfiguration: {
      adminUsername: adminUsername
      sshPublicKeys: [
        {
          keyData: sshPublicKey
        }
      ]
    }
    initialAgentPoolConfigurations: [
      {
        name: '${kubernetesClusterName}-nodepool-1'
        administratorConfiguration: {}
        count: systemPoolNodeCount
        vmSkuName: workerVmSkuName
        mode: 'System'
        labels: empty(labels) ? null : labels
        taints: empty(taints) ? null : taints
        agentOptions: empty(initialPoolAgentOptions) ? null : initialPoolAgentOptions
        attachedNetworkConfiguration: {
          l2Networks: empty(agentPoolL2Networks) ? null : agentPoolL2Networks
          l3Networks: empty(agentPoolL3Networks) ? null : agentPoolL3Networks
          trunkedNetworks: empty(agentPoolTrunkedNetworks) ? null : agentPoolTrunkedNetworks
        }
        availabilityZones: empty(agentPoolZones) ? null : agentPoolZones
        upgradeSettings: {
          maxSurge: '1'
        }
      }
    ]
    controlPlaneNodeConfiguration: {
      administratorConfiguration: {}
      count: controlPlaneCount
      vmSkuName: controlPlaneVmSkuName
      availabilityZones: empty(controlPlaneZones) ? null : controlPlaneZones
    }
    networkConfiguration: {
      cniNetworkId: cniNetworkId
      cloudServicesNetworkId: cloudServicesNetworkId
      dnsServiceIp: dnsServiceIp
      podCidrs: podCidrs
      serviceCidrs: serviceCidrs
      attachedNetworkConfiguration: {
        l2Networks: empty(l2Networks) ? null : l2Networks
        l3Networks: empty(l3Networks) ? null : l3Networks
        trunkedNetworks: empty(trunkedNetworks) ? null : trunkedNetworks
      }
      bgpServiceLoadBalancerConfiguration: {
        ipAddressPools: empty(ipAddressPools) ? null : ipAddressPools
      }
    }
  }
}
