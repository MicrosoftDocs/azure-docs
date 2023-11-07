@description('The name of Nexus virtual machine')
param vmName string

@description('The Azure region where the VM is to be deployed')
param location string = resourceGroup().location

@description('The custom location of the Nexus instance')
param extendedLocation string

@description('The metadata tags to be associated with the cluster resource')
param tags object = {}

@description('The name of the administrator to which the ssh public keys will be added into the authorized keys.')
@minLength(1)
@maxLength(32)
param adminUsername string = 'azureuser'

@description('Selects the boot method for the virtual machine.')
@allowed([
  'UEFI'
  'BIOS'
])
param bootMethod string = 'UEFI'

@description('The Cloud Services Network attachment ARM ID to attach to virtual machine.')
param cloudServicesNetworkId string

@description('Number of CPU cores for the virtual machine. Choose a value between 2 and 46.')
param cpuCores int = 2

@description('The memory size of the virtual machine in GB (max 224 GB)')
param memorySizeGB int = 4

@description('The list of network attachments to the virtual machine.')
param networkAttachments array

// {
//   attachedNetworkId: "string"
//   defaultGateway: "True"/"False"
//   ipAllocationMethod: "Dynamic"/"Static","Disabled"
//   ipv4Address: "string"
//   ipv6Address: "string"
//   networkAttachmentName: "string"
// }

@description('The Base64 encoded cloud-init network data.')
param networkData string = ''

@description('The placement hints for the virtual machine.')
param placementHints array = []
// {
//   hintType: "Affinity/AntiAffinity"
//   resourceId: string
//   schedulingExecution: "Hard/Soft"
//   scope: "Rack/Machine"
// }

@description('The list of SSH public keys for the virtual machine.')
param sshPublicKeys array
// {
//   keyData: 'string'
// }

@description('StorageProfile represents information about a disk.')
param storageProfile object = {
  osDisk: {
    createOption: 'Ephemeral'
    deleteOption: 'Delete'
    diskSizeGB: 64
  }
}

@description('The Base64 encoded cloud-init user data.')
param userData string = ''

@description('The type of the device model to use.')
@allowed([
  'T1'
  'T2'
])
param vmDeviceModel string = 'T2'

@description('The virtual machine image that is currently provisioned to the OS disk, using the full URL and tag notation used to pull the image.')
param vmImage string

@description('Credentials used to login to the image repository.')
param vmImageRepositoryCredentials object
// password: "string"
// registryUrl: "string"
// username: "string"

resource vm 'Microsoft.NetworkCloud/virtualMachines@2023-07-01' = {
  name: vmName
  location: location
  extendedLocation: {
    type: 'CustomLocation'
    name: extendedLocation
  }
  tags: tags
  properties: {
    adminUsername: (empty(adminUsername) ? null : adminUsername)
    bootMethod: (empty(bootMethod) ? null : bootMethod)
    cloudServicesNetworkAttachment: {
      attachedNetworkId: cloudServicesNetworkId
      defaultGateway: 'False'
      ipAllocationMethod: 'Dynamic'
    }
    cpuCores: cpuCores
    memorySizeGB: memorySizeGB
    networkData: (empty(networkData) ? null : networkData)
    networkAttachments: (empty(networkAttachments) ? null : networkAttachments)
    placementHints: (empty(placementHints) ? null : placementHints)
    sshPublicKeys: (empty(sshPublicKeys) ? null : sshPublicKeys)
    storageProfile: (empty(storageProfile) ? null : storageProfile)
    userData: (empty(userData) ? null : userData)
    vmDeviceModel: (empty(vmDeviceModel) ? null : vmDeviceModel)
    vmImage: (empty(vmImage) ? null : vmImage)
    vmImageRepositoryCredentials: (empty(vmImageRepositoryCredentials) ? null : vmImageRepositoryCredentials)
  }
}
