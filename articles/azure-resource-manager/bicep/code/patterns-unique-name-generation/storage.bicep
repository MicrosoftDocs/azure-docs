param location string = resourceGroup().location

param primaryStorageAccountName string = 'contosopri${uniqueString(resourceGroup().id)}'
param secondaryStorageAccountName string = 'contososec${uniqueString(resourceGroup().id)}'

resource primaryStorageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: primaryStorageAccountName
  // ...
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Premium_LRS'
  }
}

resource secondaryStorageAccount 'Microsoft.Storage/storageAccounts@2021-02-01' = {
  name: secondaryStorageAccountName
  // ...
  location: location
  kind: 'StorageV2'
  sku: {
    name: 'Premium_LRS'
  }
}
