@description('The name of the data disk')
param diskName string

@description('The size of the data disk in MiB')
param diskSize int=102400

@description('The custom location of the Nexus instance')
param extendedLocation string

@description('The Azure region where the VM is to be deployed')
param location string = resourceGroup().location

resource dataDisk 'Microsoft.NetworkCloud/volumes@2024-07-01' = {
  extendedLocation: {
    type: 'CustomLocation'
    name: extendedLocation

  }
  location: location
  name: diskName
  properties: {
    sizeMiB: diskSize
  }
}
