param location string
param sqlServerName string
param frontDoorProfileName string
param tenants array

// This needs to ge in a separate module so that we can iterate through the outputs of each tenant module's deployment and create an array of all custom domain resource IDs.

module tenantResources 'tenant-resources.bicep' = [for tenant in tenants: {
  name: 'tenant-${tenant.id}' 
  params: {
    location: location
    tenant: tenant
    sqlServerName: sqlServerName
    frontDoorProfileName: frontDoorProfileName
  }
}]

output tenantFrontDoorCustomDomainIds array = [for (tenant, index) in tenants: {
  id: tenantResources[index].outputs.frontDoorCustomDomainId
}]
