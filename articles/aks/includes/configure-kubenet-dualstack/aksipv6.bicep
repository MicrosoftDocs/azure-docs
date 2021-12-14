param clusterName string = 'aksdualstack'
param location string = resourceGroup().location
param kubernetesVersion string = '1.22.2'
param nodeCount int = 3
param nodeSize string = 'Standard_B2ms'

resource aksCluster 'Microsoft.ContainerService/managedClusters@2021-10-01' = {
  name: clusterName
  location: location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    agentPoolProfiles: [
      {
        name: 'nodepool1'
        count: nodeCount
        mode: 'System'
        vmSize: nodeSize
      }
    ]
    dnsPrefix: clusterName
    kubernetesVersion: kubernetesVersion
    networkProfile: {
      ipFamilies: [
        'IPv4'
        'IPv6'
      ]
    }
  }
}
