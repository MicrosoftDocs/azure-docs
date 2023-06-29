---
title: Compute resource provider operations include file
description: Compute resource provider operations include file
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.workload: identity
ms.topic: include
ms.date: 06/01/2023
ms.author: rolyon
ms.custom: generated
---

### microsoft.app

Azure service: [Azure Container Apps](../../../container-apps/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | microsoft.app/register/action | Register microsoft.app resource provider for the subscription |
> | microsoft.app/unregister/action | Unregister microsoft.app resource provider for the subscription |
> | microsoft.app/containerapps/write | Create or update a Container App |
> | microsoft.app/containerapps/delete | Delete a Container App |
> | microsoft.app/containerapps/read | Get a Container App |
> | microsoft.app/containerapps/listsecrets/action | List secrets of a container app |
> | microsoft.app/containerapps/listcustomhostnameanalysis/action | List custom host name analysis result |
> | microsoft.app/containerapps/authtoken/action | Get Auth Token for Container App Dev APIs to get log stream, exec or port forward from a container. |
> | microsoft.app/containerapps/getauthtoken/action | Get Auth Token for Container App Dev APIs to get log stream, exec or port forward from a container. |
> | microsoft.app/containerapps/authconfigs/read | Get auth config of a container app |
> | microsoft.app/containerapps/authconfigs/write | Create or update auth config of a container app |
> | microsoft.app/containerapps/authconfigs/delete | Delete auth config of a container app |
> | microsoft.app/containerapps/detectors/read | Get detector of a container app |
> | microsoft.app/containerapps/revisions/read | Get revision of a container app |
> | microsoft.app/containerapps/revisions/restart/action | Restart a container app revision |
> | microsoft.app/containerapps/revisions/activate/action | Activate a container app revision |
> | microsoft.app/containerapps/revisions/deactivate/action | Deactivate a container app revision |
> | microsoft.app/containerapps/revisions/replicas/read | Get replica of a container app revision |
> | microsoft.app/containerapps/sourcecontrols/write | Create or Update Container App Source Control Configuration |
> | microsoft.app/containerapps/sourcecontrols/read | Get Container App Source Control Configuration |
> | microsoft.app/containerapps/sourcecontrols/delete | Delete Container App Source Control Configuration |
> | microsoft.app/containerapps/sourcecontrols/operationresults/read | Get Container App Source Control Long Running Operation Result |
> | microsoft.app/locations/availablemanagedenvironmentsworkloadprofiletypes/read | Get Available Workload Profile Types in a Region |
> | microsoft.app/locations/billingmeters/read | Get Billing Meters in a Region |
> | microsoft.app/locations/containerappoperationresults/read | Get a Container App Long Running Operation Result |
> | microsoft.app/locations/containerappoperationstatuses/read | Get a Container App Long Running Operation Status |
> | microsoft.app/locations/managedenvironmentoperationresults/read | Get a Managed Environment Long Running Operation Result |
> | microsoft.app/locations/managedenvironmentoperationstatuses/read | Get a Managed Environment Long Running Operation Status |
> | microsoft.app/managedenvironments/join/action | Allows to create a Container App in a Managed Environment |
> | microsoft.app/managedenvironments/read | Get a Managed Environment |
> | microsoft.app/managedenvironments/write | Create or update a Managed Environment |
> | microsoft.app/managedenvironments/delete | Delete a Managed Environment |
> | microsoft.app/managedenvironments/getauthtoken/action | Get Auth Token for Managed Environment Dev APIs to get log stream, exec or port forward from a container |
> | microsoft.app/managedenvironments/checknameavailability/action | Check reource name availability for a Managed Environment |
> | microsoft.app/managedenvironments/certificates/write | Create or update a Managed Environment Certificate |
> | microsoft.app/managedenvironments/certificates/read | Get a Managed Environment's Certificate |
> | microsoft.app/managedenvironments/certificates/delete | Delete a Managed Environment's Certificate |
> | microsoft.app/managedenvironments/daprcomponents/write | Create or Update Managed Environment Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/read | Read Managed Environment Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/delete | Delete Managed Environment Dapr Component |
> | microsoft.app/managedenvironments/daprcomponents/listsecrets/action | List Secrets of a Dapr Component |
> | microsoft.app/managedenvironments/detectors/read | Get detector of a managed environment |
> | microsoft.app/managedenvironments/storages/read | Get storage for a Managed Environment. |
> | microsoft.app/managedenvironments/storages/write | Create or Update a storage of Managed Environment. |
> | microsoft.app/managedenvironments/storages/delete | Delete a storage of Managed Environment. |
> | microsoft.app/managedenvironments/workloadprofilestates/read | Get Current Workload Profile States |
> | microsoft.app/operations/read | Get a list of supported container app operations |

### Microsoft.ClassicCompute

Azure service: Classic deployment model virtual machine

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ClassicCompute/register/action | Register to Classic Compute |
> | Microsoft.ClassicCompute/checkDomainNameAvailability/action | Checks the availability of a given domain name. |
> | Microsoft.ClassicCompute/moveSubscriptionResources/action | Move all classic resources to a different subscription. |
> | Microsoft.ClassicCompute/validateSubscriptionMoveAvailability/action | Validate the subscription's availability for classic move operation. |
> | Microsoft.ClassicCompute/capabilities/read | Shows the capabilities |
> | Microsoft.ClassicCompute/checkDomainNameAvailability/read | Gets the availability of a given domain name. |
> | Microsoft.ClassicCompute/domainNames/read | Return the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/write | Add or modify the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/delete | Remove the domain names for resources. |
> | Microsoft.ClassicCompute/domainNames/swap/action | Swaps the staging slot to the production slot. |
> | Microsoft.ClassicCompute/domainNames/active/write | Sets the active domain name. |
> | Microsoft.ClassicCompute/domainNames/availabilitySets/read | Show the availability set for the resource. |
> | Microsoft.ClassicCompute/domainNames/capabilities/read | Shows the domain name capabilities |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/read | Shows the deployment slots. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/write | Creates or update the deployment. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/read | Get role on deployment slot of domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/roles/roleinstances/read | Get role instance for role on deployment slot of domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/state/read | Get the deployment slot state. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/state/write | Add the deployment slot state. |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/read | Get upgrade domain for deployment slot on domain name |
> | Microsoft.ClassicCompute/domainNames/deploymentslots/upgradedomain/write | Update upgrade domain for deployment slot on domain name |
> | Microsoft.ClassicCompute/domainNames/extensions/read | Returns the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/write | Add the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/delete | Remove the domain name extensions. |
> | Microsoft.ClassicCompute/domainNames/extensions/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/read | Gets the internal load balancers. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/write | Creates a new internal load balance. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/delete | Remove a new internal load balance. |
> | Microsoft.ClassicCompute/domainNames/internalLoadBalancers/operationStatuses/read | Reads the operation status for the domain names internal load balancers. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/read | Get the load balanced endpoint sets. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/write | Add the load balanced endpoint set. |
> | Microsoft.ClassicCompute/domainNames/loadBalancedEndpointSets/operationStatuses/read | Reads the operation status for the domain names load balanced endpoint sets. |
> | Microsoft.ClassicCompute/domainNames/operationstatuses/read | Get operation status of the domain name. |
> | Microsoft.ClassicCompute/domainNames/operationStatuses/read | Reads the operation status for the domain names extensions. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/read | Returns the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/write | Add or modify the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/delete | Delete the service certificates used. |
> | Microsoft.ClassicCompute/domainNames/serviceCertificates/operationStatuses/read | Reads the operation status for the domain names service certificates. |
> | Microsoft.ClassicCompute/domainNames/slots/read | Shows the deployment slots. |
> | Microsoft.ClassicCompute/domainNames/slots/write | Creates or update the deployment. |
> | Microsoft.ClassicCompute/domainNames/slots/delete | Deletes a given deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/start/action | Starts a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/stop/action | Suspends the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/validateMigration/action | Validates migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/prepareMigration/action | Prepares migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/commitMigration/action | Commits migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/abortMigration/action | Aborts migration of a deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/operationStatuses/read | Reads the operation status for the domain names slots. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/read | Get the role for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/write | Add role for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/read | Returns the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/write | Add or modify the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/delete | Remove the extension reference for the deployment slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/extensionReferences/operationStatuses/read | Reads the operation status for the domain names slots roles extension references. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/metricdefinitions/read | Get the role metric definition for the domain name. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/metrics/read | Get role metric for the domain name. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/operationstatuses/read | Get the operation status for the domain names slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/downloadremotedesktopconnectionfile/action | Downloads remote desktop connection file for the role instance on the domain name slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/read | Get the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/restart/action | Restarts role instances. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/reimage/action | Reimages the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/rebuild/action | Rebuilds the role instance. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/roleInstances/operationStatuses/read | Gets the operation status for the role instance on domain names slot role. |
> | Microsoft.ClassicCompute/domainNames/slots/roles/skus/read | Get role sku for the deployment slot. |
> | Microsoft.ClassicCompute/domainNames/slots/state/start/write | Changes the deployment slot state to stopped. |
> | Microsoft.ClassicCompute/domainNames/slots/state/stop/write | Changes the deployment slot state to started. |
> | Microsoft.ClassicCompute/domainNames/slots/upgradeDomain/write | Walk upgrade the domain. |
> | Microsoft.ClassicCompute/operatingSystemFamilies/read | Lists the guest operating system families available in Microsoft Azure, and also lists the operating system versions available for each family. |
> | Microsoft.ClassicCompute/operatingSystems/read | Lists the versions of the guest operating system that are currently available in Microsoft Azure. |
> | Microsoft.ClassicCompute/operations/read | Gets the list of operations. |
> | Microsoft.ClassicCompute/operationStatuses/read | Reads the operation status for the resource. |
> | Microsoft.ClassicCompute/quotas/read | Get the quota for the subscription. |
> | Microsoft.ClassicCompute/resourceTypes/skus/read | Gets the Sku list for supported resource types. |
> | Microsoft.ClassicCompute/virtualMachines/read | Retrieves list of virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/write | Add or modify virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/delete | Removes virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/capture/action | Capture a virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/start/action | Start the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/redeploy/action | Redeploys the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/performMaintenance/action | Performs maintenance on the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/restart/action | Restarts virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/stop/action | Stops the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/shutdown/action | Shutdown the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/attachDisk/action | Attaches a data disk to a virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/detachDisk/action | Detaches a data disk from virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/downloadRemoteDesktopConnectionFile/action | Downloads the RDP file for virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/read | Gets the network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/write | Adds a network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the virtual machine. |
> | Microsoft.ClassicCompute/virtualMachines/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Microsoft.ClassicCompute/virtualMachines/asyncOperations/read | Gets the possible async operations |
> | Microsoft.ClassicCompute/virtualMachines/diagnosticsettings/read | Get virtual machine diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/disks/read | Retrieves list of data disks |
> | Microsoft.ClassicCompute/virtualMachines/extensions/read | Gets the virtual machine extension. |
> | Microsoft.ClassicCompute/virtualMachines/extensions/write | Puts the virtual machine extension. |
> | Microsoft.ClassicCompute/virtualMachines/extensions/operationStatuses/read | Reads the operation status for the virtual machines extensions. |
> | Microsoft.ClassicCompute/virtualMachines/metricdefinitions/read | Get the virtual machine metric definition. |
> | Microsoft.ClassicCompute/virtualMachines/metrics/read | Gets the metrics. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/read | Gets the network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/write | Adds a network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/delete | Deletes the network security group associated with the network interface. |
> | Microsoft.ClassicCompute/virtualMachines/networkInterfaces/associatedNetworkSecurityGroups/operationStatuses/read | Reads the operation status for the virtual machines associated network security groups. |
> | Microsoft.ClassicCompute/virtualMachines/operationStatuses/read | Reads the operation status for the virtual machines. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read | Get the diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write | Add or modify diagnostics settings. |
> | Microsoft.ClassicCompute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Gets the metrics definitions. |

### Microsoft.Compute

Azure service: [Virtual Machines](../../../virtual-machines/index.yml), [Virtual Machine Scale Sets](../../../virtual-machine-scale-sets/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.Compute/register/action | Registers Subscription with Microsoft.Compute resource provider |
> | Microsoft.Compute/unregister/action | Unregisters Subscription with Microsoft.Compute resource provider |
> | Microsoft.Compute/availabilitySets/read | Get the properties of an availability set |
> | Microsoft.Compute/availabilitySets/write | Creates a new availability set or updates an existing one |
> | Microsoft.Compute/availabilitySets/delete | Deletes the availability set |
> | Microsoft.Compute/availabilitySets/vmSizes/read | List available sizes for creating or updating a virtual machine in the availability set |
> | Microsoft.Compute/capacityReservationGroups/read | Get the properties of a capacity reservation group |
> | Microsoft.Compute/capacityReservationGroups/write | Creates a new capacity reservation group or updates an existing capacity reservation group |
> | Microsoft.Compute/capacityReservationGroups/delete | Deletes the capacity reservation group |
> | Microsoft.Compute/capacityReservationGroups/deploy/action | Deploy a new VM/VMSS using Capacity Reservation Group |
> | Microsoft.Compute/capacityReservationGroups/capacityReservations/read | Get the properties of a capacity reservation |
> | Microsoft.Compute/capacityReservationGroups/capacityReservations/write | Creates a new capacity reservation or updates an existing capacity reservation |
> | Microsoft.Compute/capacityReservationGroups/capacityReservations/delete | Deletes the capacity reservation |
> | Microsoft.Compute/cloudServices/read | Get the properties of a CloudService. |
> | Microsoft.Compute/cloudServices/write | Created a new CloudService or Update an existing one. |
> | Microsoft.Compute/cloudServices/delete | Deletes the CloudService. |
> | Microsoft.Compute/cloudServices/poweroff/action | Power off the CloudService. |
> | Microsoft.Compute/cloudServices/start/action | Starts the CloudService. |
> | Microsoft.Compute/cloudServices/restart/action | Restarts one or more role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/reimage/action | Rebuilds all the disks in the role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/rebuild/action | Reimage all the  role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/delete/action | Deletes role instances in a CloudService. |
> | Microsoft.Compute/cloudServices/instanceView/read | Gets the status of a CloudService. |
> | Microsoft.Compute/cloudServices/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the CloudService. |
> | Microsoft.Compute/cloudServices/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the CloudService. |
> | Microsoft.Compute/cloudServices/providers/Microsoft.Insights/metricDefinitions/read | Gets the CloudService metrics definition |
> | Microsoft.Compute/cloudServices/roleInstances/delete | Deletes a RoleInstance from CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/read | Gets a RoleInstance from CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/restart/action | Restart a role instance of a CloudService |
> | Microsoft.Compute/cloudServices/roleInstances/reimage/action | Reimage a role instance of a CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/rebuild/action | Rebuild all the disks in a CloudService. |
> | Microsoft.Compute/cloudServices/roleInstances/instanceView/read | Gets the status of a role instance from a CloudService. |
> | Microsoft.Compute/cloudServices/roles/read | Gets a role from a CloudService. |
> | Microsoft.Compute/cloudServices/roles/write | Scale instances in a Role |
> | Microsoft.Compute/cloudServices/roles/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the CloudService Roles. |
> | Microsoft.Compute/cloudServices/roles/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the CloudService Roles |
> | Microsoft.Compute/cloudServices/roles/providers/Microsoft.Insights/metricDefinitions/read | Gets the CloudService Roles Metric Definitions |
> | Microsoft.Compute/cloudServices/updateDomains/read | Gets a list of all update domains in a CloudService. |
> | Microsoft.Compute/diskAccesses/read | Get the properties of DiskAccess resource |
> | Microsoft.Compute/diskAccesses/write | Create a new DiskAccess resource or update an existing one |
> | Microsoft.Compute/diskAccesses/delete | Delete a DiskAccess resource |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionsApproval/action | Auto Approve a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/read | Get the properties of a private endpoint connection proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/write | Create a new Private Endpoint Connection Proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/delete | Delete a Private Endpoint Connection Proxy |
> | Microsoft.Compute/diskAccesses/privateEndpointConnectionProxies/validate/action | Validate a Private Endpoint Connection Proxy object |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/delete | Delete a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/read | Get a Private Endpoint Connection |
> | Microsoft.Compute/diskAccesses/privateEndpointConnections/write | Approve or Reject a Private Endpoint Connection |
> | Microsoft.Compute/diskEncryptionSets/read | Get the properties of a disk encryption set |
> | Microsoft.Compute/diskEncryptionSets/write | Create a new disk encryption set or update an existing one |
> | Microsoft.Compute/diskEncryptionSets/delete | Delete a disk encryption set |
> | Microsoft.Compute/disks/read | Get the properties of a Disk |
> | Microsoft.Compute/disks/write | Creates a new Disk or updates an existing one |
> | Microsoft.Compute/disks/delete | Deletes the Disk |
> | Microsoft.Compute/disks/beginGetAccess/action | Get the SAS URI of the Disk for blob access |
> | Microsoft.Compute/disks/endGetAccess/action | Revoke the SAS URI of the Disk |
> | Microsoft.Compute/galleries/read | Gets the properties of Gallery |
> | Microsoft.Compute/galleries/write | Creates a new Gallery or updates an existing one |
> | Microsoft.Compute/galleries/delete | Deletes the Gallery |
> | Microsoft.Compute/galleries/share/action | Shares a Gallery to different scopes |
> | Microsoft.Compute/galleries/applications/read | Gets the properties of Gallery Application |
> | Microsoft.Compute/galleries/applications/write | Creates a new Gallery Application or updates an existing one |
> | Microsoft.Compute/galleries/applications/delete | Deletes the Gallery Application |
> | Microsoft.Compute/galleries/applications/versions/read | Gets the properties of Gallery Application Version |
> | Microsoft.Compute/galleries/applications/versions/write | Creates a new Gallery Application Version or updates an existing one |
> | Microsoft.Compute/galleries/applications/versions/delete | Deletes the Gallery Application Version |
> | Microsoft.Compute/galleries/images/read | Gets the properties of Gallery Image |
> | Microsoft.Compute/galleries/images/write | Creates a new Gallery Image or updates an existing one |
> | Microsoft.Compute/galleries/images/delete | Deletes the Gallery Image |
> | Microsoft.Compute/galleries/images/versions/read | Gets the properties of Gallery Image Version |
> | Microsoft.Compute/galleries/images/versions/write | Creates a new Gallery Image Version or updates an existing one |
> | Microsoft.Compute/galleries/images/versions/delete | Deletes the Gallery Image Version |
> | Microsoft.Compute/galleries/serviceArtifacts/read | Gets the properties of Gallery Service Artifact |
> | Microsoft.Compute/galleries/serviceArtifacts/write | Creates a new Gallery Service Artifact or updates an existing one |
> | Microsoft.Compute/galleries/serviceArtifacts/delete | Deletes the Gallery Service Artifact |
> | Microsoft.Compute/hostGroups/read | Get the properties of a host group |
> | Microsoft.Compute/hostGroups/write | Creates a new host group or updates an existing host group |
> | Microsoft.Compute/hostGroups/delete | Deletes the host group |
> | Microsoft.Compute/hostGroups/hosts/read | Get the properties of a host |
> | Microsoft.Compute/hostGroups/hosts/write | Creates a new host or updates an existing host |
> | Microsoft.Compute/hostGroups/hosts/delete | Deletes the host |
> | Microsoft.Compute/images/read | Get the properties of the Image |
> | Microsoft.Compute/images/write | Creates a new Image or updates an existing one |
> | Microsoft.Compute/images/delete | Deletes the image |
> | Microsoft.Compute/locations/capsOperations/read | Gets the status of an asynchronous Caps operation |
> | Microsoft.Compute/locations/cloudServiceOsFamilies/read | Read any guest OS Family that can be specified in the XML service configuration (.cscfg) for a Cloud Service. |
> | Microsoft.Compute/locations/cloudServiceOsVersions/read | Read any guest OS Version that can be specified in the XML service configuration (.cscfg) for a Cloud Service. |
> | Microsoft.Compute/locations/communityGalleries/read | Get the properties of a Community Gallery |
> | Microsoft.Compute/locations/communityGalleries/images/read | Get the properties of a Community Gallery Image |
> | Microsoft.Compute/locations/communityGalleries/images/versions/read | Get the properties of a Community Gallery Image Version |
> | Microsoft.Compute/locations/diagnosticOperations/read | Gets status of a Compute Diagnostic operation |
> | Microsoft.Compute/locations/diagnostics/diskInspection/action | Create a request for executing DiskInspection Diagnostic |
> | Microsoft.Compute/locations/diagnostics/read | Gets the properties of all available Compute Disgnostics |
> | Microsoft.Compute/locations/diagnostics/diskInspection/read | Gets the properties of DiskInspection Diagnostic |
> | Microsoft.Compute/locations/diskOperations/read | Gets the status of an asynchronous Disk operation |
> | Microsoft.Compute/locations/edgeZones/publishers/read | Get the properties of a Publisher in an edge zone |
> | Microsoft.Compute/locations/edgeZones/publishers/artifacttypes/offers/read | Get the properties of a Platform Image Offer in an edge zone |
> | Microsoft.Compute/locations/edgeZones/publishers/artifacttypes/offers/skus/read | Get the properties of a Platform Image Sku in an edge zone |
> | Microsoft.Compute/locations/edgeZones/publishers/artifacttypes/offers/skus/versions/read | Get the properties of a Platform Image Version in an edge zone |
> | Microsoft.Compute/locations/logAnalytics/getRequestRateByInterval/action | Create logs to show total requests by time interval to aid throttling diagnostics. |
> | Microsoft.Compute/locations/logAnalytics/getThrottledRequests/action | Create logs to show aggregates of throttled requests grouped by ResourceName, OperationName, or the applied Throttle Policy. |
> | Microsoft.Compute/locations/operations/read | Gets the status of an asynchronous operation |
> | Microsoft.Compute/locations/privateEndpointConnectionProxyAzureAsyncOperation/read | Get the status of asynchronous Private Endpoint Connection Proxy operation |
> | Microsoft.Compute/locations/privateEndpointConnectionProxyOperationResults/read | Get the results of Private Endpoint Connection Proxy operation |
> | Microsoft.Compute/locations/publishers/read | Get the properties of a Publisher |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/read | Get the properties of a Platform Image Offer |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/read | Get the properties of a Platform Image Sku |
> | Microsoft.Compute/locations/publishers/artifacttypes/offers/skus/versions/read | Get the properties of a Platform Image Version |
> | Microsoft.Compute/locations/publishers/artifacttypes/types/read | Get the properties of a VMExtension Type |
> | Microsoft.Compute/locations/publishers/artifacttypes/types/versions/read | Get the properties of a VMExtension Version |
> | Microsoft.Compute/locations/runCommands/read | Lists available run commands in location |
> | Microsoft.Compute/locations/sharedGalleries/read | Get the properties of a Shared Gallery |
> | Microsoft.Compute/locations/sharedGalleries/images/read | Get the properties of a Shared Gallery Image |
> | Microsoft.Compute/locations/sharedGalleries/images/versions/read | Get the properties of a Shared Gallery Image Version |
> | Microsoft.Compute/locations/usages/read | Gets service limits and current usage quantities for the subscription's compute resources in a location |
> | Microsoft.Compute/locations/vmSizes/read | Lists available virtual machine sizes in a location |
> | Microsoft.Compute/locations/vsmOperations/read | Gets the status of an asynchronous operation for Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/operations/read | Lists operations available on Microsoft.Compute resource provider |
> | Microsoft.Compute/proximityPlacementGroups/read | Get the Properties of a Proximity Placement Group |
> | Microsoft.Compute/proximityPlacementGroups/write | Creates a new Proximity Placement Group or updates an existing one |
> | Microsoft.Compute/proximityPlacementGroups/delete | Deletes the Proximity Placement Group |
> | Microsoft.Compute/restorePointCollections/read | Get the properties of a restore point collection |
> | Microsoft.Compute/restorePointCollections/write | Creates a new restore point collection or updates an existing one |
> | Microsoft.Compute/restorePointCollections/delete | Deletes the restore point collection and contained restore points |
> | Microsoft.Compute/restorePointCollections/restorePoints/read | Get the properties of a restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/write | Creates a new restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/delete | Deletes the restore point |
> | Microsoft.Compute/restorePointCollections/restorePoints/retrieveSasUris/action | Get the properties of a restore point along with blob SAS URIs |
> | Microsoft.Compute/restorePointCollections/restorePoints/diskRestorePoints/read | Get the properties of an incremental DiskRestorePoint |
> | Microsoft.Compute/restorePointCollections/restorePoints/diskRestorePoints/beginGetAccess/action | Get the SAS URI of the incremental DiskRestorePoint |
> | Microsoft.Compute/restorePointCollections/restorePoints/diskRestorePoints/endGetAccess/action | Revoke the SAS URI of the incremental DiskRestorePoint |
> | Microsoft.Compute/sharedVMExtensions/read | Gets the properties of Shared VM Extension |
> | Microsoft.Compute/sharedVMExtensions/write | Creates a new Shared VM Extension or updates an existing one |
> | Microsoft.Compute/sharedVMExtensions/delete | Deletes the Shared VM Extension |
> | Microsoft.Compute/sharedVMExtensions/versions/read | Gets the properties of Shared VM Extension Version |
> | Microsoft.Compute/sharedVMExtensions/versions/write | Creates a new Shared VM Extension Version or updates an existing one |
> | Microsoft.Compute/sharedVMExtensions/versions/delete | Deletes the Shared VM Extension Version |
> | Microsoft.Compute/sharedVMImages/read | Get the properties of a SharedVMImage |
> | Microsoft.Compute/sharedVMImages/write | Creates a new SharedVMImage or updates an existing one |
> | Microsoft.Compute/sharedVMImages/delete | Deletes the SharedVMImage |
> | Microsoft.Compute/sharedVMImages/versions/read | Get the properties of a SharedVMImageVersion |
> | Microsoft.Compute/sharedVMImages/versions/write | Create a new SharedVMImageVersion or update an existing one |
> | Microsoft.Compute/sharedVMImages/versions/delete | Delete a SharedVMImageVersion |
> | Microsoft.Compute/sharedVMImages/versions/replicate/action | Replicate a SharedVMImageVersion to target regions |
> | Microsoft.Compute/skus/read | Gets the list of Microsoft.Compute SKUs available for your Subscription |
> | Microsoft.Compute/snapshots/read | Get the properties of a Snapshot |
> | Microsoft.Compute/snapshots/write | Create a new Snapshot or update an existing one |
> | Microsoft.Compute/snapshots/delete | Delete a Snapshot |
> | Microsoft.Compute/snapshots/beginGetAccess/action | Get the SAS URI of the Snapshot for blob access |
> | Microsoft.Compute/snapshots/endGetAccess/action | Revoke the SAS URI of the Snapshot |
> | Microsoft.Compute/sshPublicKeys/read | Get the properties of an SSH public key |
> | Microsoft.Compute/sshPublicKeys/write | Creates a new SSH public key or updates an existing SSH public key |
> | Microsoft.Compute/sshPublicKeys/delete | Deletes the SSH public key |
> | Microsoft.Compute/sshPublicKeys/generateKeyPair/action | Generates a new SSH public/private key pair |
> | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Microsoft.Compute/virtualMachines/write | Creates a new virtual machine or updates an existing virtual machine |
> | Microsoft.Compute/virtualMachines/delete | Deletes the virtual machine |
> | Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
> | Microsoft.Compute/virtualMachines/powerOff/action | Powers off the virtual machine. Note that the virtual machine will continue to be billed. |
> | Microsoft.Compute/virtualMachines/reapply/action | Reapplies a virtual machine's current model |
> | Microsoft.Compute/virtualMachines/redeploy/action | Redeploys virtual machine |
> | Microsoft.Compute/virtualMachines/restart/action | Restarts the virtual machine |
> | Microsoft.Compute/virtualMachines/retrieveBootDiagnosticsData/action | Retrieves boot diagnostic logs blob URIs |
> | Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
> | Microsoft.Compute/virtualMachines/generalize/action | Sets the virtual machine state to Generalized and prepares the virtual machine for capture |
> | Microsoft.Compute/virtualMachines/capture/action | Captures the virtual machine by copying virtual hard disks and generates a template that can be used to create similar virtual machines |
> | Microsoft.Compute/virtualMachines/runCommand/action | Executes a predefined script on the virtual machine |
> | Microsoft.Compute/virtualMachines/convertToManagedDisks/action | Converts the blob based disks of the virtual machine to managed disks |
> | Microsoft.Compute/virtualMachines/performMaintenance/action | Performs Maintenance Operation on the VM. |
> | Microsoft.Compute/virtualMachines/reimage/action | Reimages virtual machine which is using differencing disk. |
> | Microsoft.Compute/virtualMachines/installPatches/action | Installs available OS update patches on the virtual machine based on parameters provided by user. Assessment results containing list of available patches will also get refreshed as part of this. |
> | Microsoft.Compute/virtualMachines/assessPatches/action | Assesses the virtual machine and finds list of available OS update patches for it. |
> | Microsoft.Compute/virtualMachines/cancelPatchInstallation/action | Cancels the ongoing install OS update patch operation on the virtual machine. |
> | Microsoft.Compute/virtualMachines/simulateEviction/action | Simulates the eviction of spot Virtual Machine |
> | Microsoft.Compute/virtualMachines/extensions/read | Get the properties of a virtual machine extension |
> | Microsoft.Compute/virtualMachines/extensions/write | Creates a new virtual machine extension or updates an existing one |
> | Microsoft.Compute/virtualMachines/extensions/delete | Deletes the virtual machine extension |
> | Microsoft.Compute/virtualMachines/instanceView/read | Gets the detailed runtime status of the virtual machine and its resources |
> | Microsoft.Compute/virtualMachines/patchAssessmentResults/latest/read | Retrieves the summary of the latest patch assessment operation |
> | Microsoft.Compute/virtualMachines/patchAssessmentResults/latest/softwarePatches/read | Retrieves list of patches assessed during the last patch assessment operation |
> | Microsoft.Compute/virtualMachines/patchInstallationResults/read | Retrieves the summary of the latest patch installation operation |
> | Microsoft.Compute/virtualMachines/patchInstallationResults/softwarePatches/read | Retrieves list of patches attempted to be installed during the last patch installation operation |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the Virtual Machine. |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Virtual Machine. |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Virtual Machine. |
> | Microsoft.Compute/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Reads Virtual Machine Metric Definitions |
> | Microsoft.Compute/virtualMachines/runCommands/read | Get the properties of a virtual machine run command |
> | Microsoft.Compute/virtualMachines/runCommands/write | Creates a new virtual machine run command or updates an existing one |
> | Microsoft.Compute/virtualMachines/runCommands/delete | Deletes the virtual machine run command |
> | Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | Microsoft.Compute/virtualMachineScaleSets/read | Get the properties of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/write | Creates a new Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/delete | Deletes the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/delete/action | Deletes the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/start/action | Starts the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/powerOff/action | Powers off the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/restart/action | Restarts the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/deallocate/action | Powers off and releases the compute resources for the instances of the Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/manualUpgrade/action | Manually updates instances to latest model of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reimage/action | Reimages the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for the instances of a Virtual Machine Scale Set  |
> | Microsoft.Compute/virtualMachineScaleSets/redeploy/action | Redeploy the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/performMaintenance/action | Performs planned maintenance on the instances of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/scale/action | Verify if an existing Virtual Machine Scale Set can Scale In/Scale Out to specified instance count |
> | Microsoft.Compute/virtualMachineScaleSets/forceRecoveryServiceFabricPlatformUpdateDomainWalk/action | Manually walk the platform update domains of a service fabric Virtual Machine Scale Set to finish a pending update that is stuck |
> | Microsoft.Compute/virtualMachineScaleSets/osRollingUpgrade/action | Starts a rolling upgrade to move all Virtual Machine Scale Set instances to the latest available Platform Image OS version. |
> | Microsoft.Compute/virtualMachineScaleSets/setOrchestrationServiceState/action | Sets the state of an orchestration service based on the action provided in operation input. |
> | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/action | Cancels the rolling upgrade of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/read | Gets the properties of a Virtual Machine Scale Set Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/write | Creates a new Virtual Machine Scale Set Extension or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/delete | Deletes the Virtual Machine Scale Set Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/roles/read | Gets the properties of a Role in a Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/virtualMachineScaleSets/extensions/roles/write | Updates the properties of an existing Role in a Virtual Machine Scale Set with the Virtual Machine Runtime Service Extension |
> | Microsoft.Compute/virtualMachineScaleSets/instanceView/read | Gets the instance view of the Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/networkInterfaces/read | Get properties of all network interfaces of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/osUpgradeHistory/read | Gets the history of OS upgrades for a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/diagnosticSettings/read | Gets the diagnostic setting for the Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/diagnosticSettings/write | Creates or updates the diagnostic setting for the Virtual Machine Scale set. |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/logDefinitions/read | Gets the available logs for Virtual Machine Scale Sets. |
> | Microsoft.Compute/virtualMachineScaleSets/providers/Microsoft.Insights/metricDefinitions/read | Reads Virtual Machine Scale Set Metric Definitions |
> | Microsoft.Compute/virtualMachineScaleSets/publicIPAddresses/read | Get properties of all public IP addresses of a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/rollingUpgrades/read | Get latest Rolling Upgrade status for a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/skus/read | Lists the valid SKUs for an existing Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/read | Retrieves the properties of a Virtual Machine in a VM Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/write | Updates the properties of a Virtual Machine in a VM Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/delete | Delete a specific Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/start/action | Starts a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/powerOff/action | Powers Off a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/restart/action | Restarts a Virtual Machine instance in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/deallocate/action | Powers off and releases the compute resources for a Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimage/action | Reimages a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/reimageAll/action | Reimages all disks (OS Disk and Data Disks) for Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/redeploy/action | Redeploys a Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/retrieveBootDiagnosticsData/action | Retrieves boot diagnostic logs blob URIs of Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/performMaintenance/action | Performs planned maintenance on a Virtual Machine instance in a Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommand/action | Executes a predefined script on a Virtual Machine instance in a Virtual Machine Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/simulateEviction/action | Simulates the eviction of spot Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/read | Get the properties of an extension for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/write | Creates a new extension for Virtual Machine in Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/extensions/delete | Deletes the extension for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/instanceView/read | Retrieves the instance view of a Virtual Machine in a VM Scale Set. |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/read | Get properties of one or all network interfaces of a virtual machine created using Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/read | Get properties of one or all IP configurations of a network interface created using Virtual Machine Scale Set. IP configurations represent private IPs |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/networkInterfaces/ipConfigurations/publicIPAddresses/read | Get properties of public IP address created using Virtual Machine Scale Set. Virtual Machine Scale Set can create at most one public IP per ipconfiguration (private IP) |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/providers/Microsoft.Insights/metricDefinitions/read | Reads Virtual Machine in Scale Set Metric Definitions |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/read | Get the properties of a run command for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/write | Creates a new run command for Virtual Machine in Virtual Machine Scale Set or updates an existing one |
> | Microsoft.Compute/virtualMachineScaleSets/virtualMachines/runCommands/delete | Deletes the run command for Virtual Machine in Virtual Machine Scale Set |
> | Microsoft.Compute/virtualMachineScaleSets/vmSizes/read | List available sizes for creating or updating a virtual machine in the Virtual Machine Scale Set |
> | **DataAction** | **Description** |
> | Microsoft.Compute/disks/download/action | Perform read data operations on Disk SAS Uri |
> | Microsoft.Compute/disks/upload/action | Perform write data operations on Disk SAS Uri |
> | Microsoft.Compute/snapshots/download/action | Perform read data operations on Snapshot SAS Uri |
> | Microsoft.Compute/snapshots/upload/action | Perform write data operations on Snapshot SAS Uri |
> | Microsoft.Compute/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | Microsoft.Compute/virtualMachines/loginAsAdmin/action | Log in to a virtual machine with Windows administrator or Linux root user privileges |
> | Microsoft.Compute/virtualMachines/WACloginAsAdmin/action | Lets you manage the OS of your resource via Windows Admin Center as an administrator |

### Microsoft.ServiceFabric

Azure service: [Service Fabric](../../../service-fabric/index.yml)

> [!div class="mx-tableFixed"]
> | Action | Description |
> | --- | --- |
> | Microsoft.ServiceFabric/register/action | Register any Action |
> | Microsoft.ServiceFabric/clusters/read | Read any Cluster |
> | Microsoft.ServiceFabric/clusters/write | Create or Update any Cluster |
> | Microsoft.ServiceFabric/clusters/delete | Delete any Cluster |
> | Microsoft.ServiceFabric/clusters/applications/read | Read any Application |
> | Microsoft.ServiceFabric/clusters/applications/write | Create or Update any Application |
> | Microsoft.ServiceFabric/clusters/applications/delete | Delete any Application |
> | Microsoft.ServiceFabric/clusters/applications/services/read | Read any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/write | Create or Update any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/delete | Delete any Service |
> | Microsoft.ServiceFabric/clusters/applications/services/partitions/read | Read any Partition |
> | Microsoft.ServiceFabric/clusters/applications/services/partitions/replicas/read | Read any Replica |
> | Microsoft.ServiceFabric/clusters/applications/services/statuses/read | Read any Service Status |
> | Microsoft.ServiceFabric/clusters/applicationTypes/read | Read any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/write | Create or Update any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/delete | Delete any Application Type |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/read | Read any Application Type Version |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/write | Create or Update any Application Type Version |
> | Microsoft.ServiceFabric/clusters/applicationTypes/versions/delete | Delete any Application Type Version |
> | Microsoft.ServiceFabric/clusters/nodes/read | Read any Node |
> | Microsoft.ServiceFabric/clusters/statuses/read | Read any Cluster Status |
> | Microsoft.ServiceFabric/locations/clusterVersions/read | Read any Cluster Version |
> | Microsoft.ServiceFabric/locations/environments/clusterVersions/read | Read any Cluster Version for a specific environment |
> | Microsoft.ServiceFabric/locations/operationresults/read | Read any Operation Results |
> | Microsoft.ServiceFabric/locations/operations/read | Read any Operations by location |
> | Microsoft.ServiceFabric/managedclusters/read | Read any Managed Clusters |
> | Microsoft.ServiceFabric/managedclusters/write | Create or Update any Managed Clusters |
> | Microsoft.ServiceFabric/managedclusters/delete | Delete any Managed Clusters |
> | Microsoft.ServiceFabric/managedclusters/applications/read | Read any Application |
> | Microsoft.ServiceFabric/managedclusters/applications/write | Create or Update any Application |
> | Microsoft.ServiceFabric/managedclusters/applications/delete | Delete any Application |
> | Microsoft.ServiceFabric/managedclusters/applications/services/read | Read any Service |
> | Microsoft.ServiceFabric/managedclusters/applications/services/write | Create or Update any Service |
> | Microsoft.ServiceFabric/managedclusters/applications/services/delete | Delete any Service |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/read | Read any Application Type |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/write | Create or Update any Application Type |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/delete | Delete any Application Type |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/versions/read | Read any Application Type Version |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/versions/write | Create or Update any Application Type Version |
> | Microsoft.ServiceFabric/managedclusters/applicationTypes/versions/delete | Delete any Application Type Version |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/read | Read any Node Type |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/write | Create or Update any Node Type |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/delete | Delete Node Type |
> | Microsoft.ServiceFabric/managedclusters/nodetypes/skus/read | Read Node Type supported SKUs |
> | Microsoft.ServiceFabric/operations/read | Read any Available Operations |
