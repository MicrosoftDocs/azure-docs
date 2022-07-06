---
title: Azure Monitor for SAP Solutions Network Considerations | Microsoft Docs
description: This article provides details to consider network setup while setting up Azure monitor for SAP solutions.
author: sujaj
ms.service: virtual-machines-sap
ms.subservice: baremetal-sap
ms.topic: article
ms.date: 07/06/2022
ms.author: sujaj

---
# Primary Network considerations for AMS 

Before Azure Monitor for SAP solutions (AMS) is deployed for the first time, following two areas regarding Networking must be addressed. 

1. _**(Mandatory for all)**_ Create a new subnet within VNET, which has network connectivity with source systems you want to monitor
2. _**(Only if applicable)**_ Choose an option to address no-outbound internet access from VNET in which source systems you want to monitor are deployed

For more information, please read the following.

## 1. _**(Mandatory for all)**_ Create a new subnet

Create a new empty subnet that's an IPv4/28 block or larger and ensure there is network connectivity between this new subnet and target systems you wish to monitor. This new subnet will be used to host Azure Functions. Azure Function is the telemetry collection engine for AMS. Refer [this](https://docs.microsoft.com/azure/app-service/overview-vnet-integration) article for more details and [learn more](https://docs.microsoft.com/azure/azure-functions/functions-networking-options#subnets) about subnets for Azure functions.

>[!Note]
> Content below is applicable to Azure Monitor for SAP solutions and not the classic version
## 2. _**(Only if applicable)**_ Choose an option to address no-outbound internet access

Many customers choose to lockdown their SAP network environment by restricting or blocking outbound-internet access. If this scenario is applicable for you, choose one of the following methods to address it. It is highly recommended that you pick one of the following methods, perform the needed actions before trying to deploy first AMS resource. Without addressing this scenario, AMS deployments will likely fail. 

Following are two methods to address restricted/blocked outbound-internet access from SAP environemnt. You can choose the one that makes most sense for you.

Option 1: _**Route All**_ 

Option 2: _**Service Tags**_

Option 3: _**Private Endpoints**_

Following section describes both these options for your consideration: 

### Option 1: _**Route All**_ 

Route All is a standard feature in Azure functions, it is a setting of Azure functions that you can enable or disable. Your selection (enable/disable) for route-all setting only affects traffic from Azure functions, which is deployed as part of AMS deployment. This selection does _**not**_ affect any other incoming/outgoing traffic within your VNET. [Learn more](https://docs.microsoft.com/azure/azure-functions/functions-networking-options#virtual-network-integration) about Route All in Azure functions.

_Pre AMS deployment action_:      
If you choose to go with this option, you need to take an action before/during AMS resource creation. You can select enable/disable for route-all setting while creating your AMS resource with portal 'create' experience. If outbound internet access is not allowed from your environment, select 'disable' for this field. If outbound internet access is allowed from your environment, you can leave this selection as 'enable'.

Note: During private preview, once the selection (enable/disable) is made, it cannot be changed. However, for future milestone we are considering a feature where you can change your selection (enable/disable) for route-all setting.  

### Option 2: _**Service Tags**_ 

If you use Network Security Groups (NSGs), you can create AMS related service tags to allow appropriate traffic flow for successfully deploy AMS. A service tag represents a group of IP address prefixes from a given Azure service. [Learn more](https://docs.microsoft.com/azure/virtual-network/service-tags-overview) about virtual network service tags. 

_Post AMS deployment action_:      
If you choose to go with this option,  follow the steps mentioned below:

1. Find subnet associated with AMS managed resource group     
      a. Navigate to your AMS resource, overview tab     
      b. Inside managed resource group, select Azure functions app    
      c. In functions app, navigate to Networking tab and click on VNET Integration      
      d. Scroll down to find Subnet details    
2. Find Network Security Group (NSG) associated with Subnet by clicking Subnet name. Make note of this NSG    
3. Set new NSG rules for outbound network traffic    
      a. Navigate to NSG      
      b. On left panel, under Settings, navigate to Outbound security rules    
      c. Add following new rules by clicking Add button on top               
          * **Priority**: 450, **Name**: allow_monitor, **Port**: 443, **Protocol**: TCP, **Source**: <AMS subnet IP>, **Destination**: AzureMonitor, **Action**: Allow
          * **Priority**: 501, **Name**: allow_keyVault, **Port**: 443, **Protocol**: TCP, **Source**: <AMS subnet IP>, **Destination**: AzureKeyVault, **Action**: Allow
          * **Priority**: 550, **Name**: allow_storage, **Port**: 443, **Protocol**: TCP, **Source**: <AMS subnet IP>, **Destination**: Storage, **Action**: Allow
          * **Priority**: 600, **Name**: allow_azure_controlplane, **Port**: 443, **Protocol**: Any, **Source**: <AMS subnet IP>, **Destination**: AzureResourceManager, **Action**: Allow
          * **Priority**: 660, **Name**: deny_internet, **Port**: any, **Protocol**: Any, **Source**: Any, **Destination**: Internet, **Action**: Deny

 >* AMS subnet IP refers to Ip of subnet associated with AMS resource  
<img width="1004" alt="IPSubnet" src="https://user-images.githubusercontent.com/33844181/176853982-ce90631d-d352-471e-9339-92a2efa17660.png">
         
 >* The priority order for deny_internet and allow_vnet is important, allow_vnet should have a lower priority than deny_internet      
 >*  The priority order for other rules is interchangeable, all of them should have priority less than allow_vnet    
        
### Option 3: _**Private Endpoints**_ 
To enable private endpoint, a new subnet is required in the same vnet as the source system (system you wish you monitor). This subnet must not be delegated to any other resource, hence the subnet used by azure function cannot be used to create private endpoints. 
Once new subnet is created, follow these steps: 

In Azure monitor for SAP Solutions overview blade, go to managed resource group. 
![MRG](https://user-images.githubusercontent.com/33844181/176844395-c98164bf-8754-477e-8425-090b86d6b294.png)

A private endpoint connection needs to be created for the following resources inside the managed resource group: 
1. Key-vault, 
2. Storage-account, and 
3. Log-analytics workspace

![LogAnalytics](https://user-images.githubusercontent.com/33844181/176844487-388fbea4-4821-4c8d-90af-917ff9c0ba48.png)
 
_**Key Vault**_ 
Only 1 private endpoint is required for all the key vault resources (secrets, certificates, and keys). Once a private endpoint is created for key vault, the vault resources cannot be accessed from systems outside the given vnet. 

Go to the networking tab of the key vault under settings. 
![KeyVault](https://user-images.githubusercontent.com/33844181/176844573-5f4336c2-7fc2-4f4b-b028-1687829fdeff.png)

Private endpoint connections -> Create 
Select the region for private endpoint.
 
![KV Resources](https://user-images.githubusercontent.com/33844181/176844718-54ec39a9-6534-4ffb-8786-39bff1a9bd7f.png)

Select the resource, and target sub-resource for which private endpoint is required. (Only one sub-resource available for key vault.) 

![Subresources](https://user-images.githubusercontent.com/33844181/176844740-d6f375fb-7e71-4331-b10d-ec7e659d0f6e.png)

Select the vnet, and subnet. (The subnet used for function app cannot be used for endpoint creation). 
![VNet](https://user-images.githubusercontent.com/33844181/176844768-8b8f065b-ebaf-4274-a756-5a7fec96d877.png)

Integrate the resource with a private DNS zone and add tags (if necessary). 
![Private DNS](https://user-images.githubusercontent.com/33844181/176844798-a183ab5f-a215-4a9d-a582-f8d7e6348e4d.png)

Hit review and create. 
In the networking tab, use the following access policy. This will allow the service to access the key-vault resources.
 
![Access Policy](https://user-images.githubusercontent.com/33844181/176844835-31f17aa4-4b0f-4777-a613-806b53ebed30.png)
 
_**Storage Account**_ 

A separate private endpoint is required for each storage account resource (queue, table, storage blob, and file). If we create a private endpoint for storage queue, we cannot access it from systems outside the vnet (including azure portal). But other resources of the same storage account can be accessed. 

Follow the same steps to create private endpoints as the key vault resource. 
Choose the following resource type:
![Storage Account](https://user-images.githubusercontent.com/33844181/176844967-a7fb437a-436d-4e95-b42a-c5a7679acb73.png)

Repeat the above steps for each sub-resource type required. (Table, queue, blob, and file in our case) 

_**Log Analytics Workspace**_ 
Private endpoint cannot be created for laws directly. To enable private endpoint for Laws, we need to connect it to an Azure Monitor Private Link Scope, and then create a private endpoint for the Azure Monitor Private Link Scope. 

Note: If any system is accessing laws before enabling private endpoint (that is, using public endpoint), that system will continue to use public endpoint until restarted.  

Thus, private endpoint for laws must be enabled before provider creation else the azure function would not be unable to access laws until restarted. 

Go to the network isolation tab under settings. -> Add 
![Private End Point](https://user-images.githubusercontent.com/33844181/176845051-de81c366-b356-4326-b27d-c6c2005e614e.png)

Select the desired scope -> hit apply. 
![Scope Apply](https://user-images.githubusercontent.com/33844181/176845071-ef15b2e3-6f24-4c28-98d2-50437e69bd92.png)

To enable private endpoint for Azure Monitor Private Link Scope, go to Private Endpoint connections tab under configure. 
![EndPoint Resources](https://user-images.githubusercontent.com/33844181/176845102-3b5d813e-eb0d-445c-a5fb-9262947eda77.png)

Follow the same steps as key vault, and choose the following resource type, and sub-resource type: 
![Endpoint SubResources](https://user-images.githubusercontent.com/33844181/176845132-6798946b-117e-41f8-ad29-add016cba3b7.png)

In the network isolation tab for laws, select the following network access configurations.	 
Accept data ingestion from public networks: NO (To disable data ingestion from any system outside the vnet.) 
Accept queries from public networks: YES (This is necessary for workbooks to display data properly.) 
![Network Isolation](https://user-images.githubusercontent.com/33844181/176845179-c3596e46-59e4-46a5-b21b-e46401881a19.png)
 

+**Restart azure function apps**_ 
If private endpoint for log-analytics is enabled after any provider creation, then all the function apps in managed resource group must be restarted. 
In Azure monitor for SAP Solutions overview blade, go to managed resource group. 

![ManagedResourceGroup](https://user-images.githubusercontent.com/33844181/176845240-eb49d173-9a8f-4582-aabc-0e6c5f5ab302.png)

Find all the function apps in the managed resource group: 
![FuncApp](https://user-images.githubusercontent.com/33844181/176845270-2d680a2f-d00b-4de0-aca2-f7b1a162dfc6.png)

In the function app overview blade, click on restart button 
![Restart](https://user-images.githubusercontent.com/33844181/176845302-a414cba4-4753-47c2-b8ab-5dee75b366c6.png)


_**NSG rules to disable outbound internet calls**_  
_**Find source IP range for AMS resource**_ 

From overview blade of AMS resource, got to vnet used to create the AMS resource. 
![VNET](https://user-images.githubusercontent.com/33844181/176845441-b7016812-9c12-4056-ba35-dc0cc053894e.png)

The IPV4 range is the desired source system IP address range. 
![IP Range](https://user-images.githubusercontent.com/33844181/176845466-1fb078d4-d73a-4f31-897d-208b847e7114.png)

_**Find the ip-range for private endpoints created in above steps**_

For key-vault, and storage account private endpoints:  
Find the private endpoint created for key-vault/storage-account. 
![EndPoint](https://user-images.githubusercontent.com/33844181/176845509-a3552ca3-4a0a-4504-9e5d-c7c82e6adf32.png)

You will find the ip-address for private endpoint in DNS configuration blade under settings. 
![ip for private endpoint](https://user-images.githubusercontent.com/33844181/176845560-d8425048-1a34-41c2-b580-f0ed95718f5c.png)


For Log analytics private endpoint: 
Go to the private endpoint created for Azure Monitor Private Link Scope resource. 
![linked scope resource](https://user-images.githubusercontent.com/33844181/176845649-0ccef546-c511-4373-ac3d-cbf9e857ca78.png)

The required IP can be found in DNS configurations under settings tab with configuration name: privatelink-ods-opinsights-azure-com 
![go to Vnet](https://user-images.githubusercontent.com/33844181/176845682-03e98ee7-e188-4737-9d10-6ab1a2ca3fa6.png)

Required outbound NSG rules: 
From overview blade of AMS resource, got to vnet used to create the AMS resource. 
![VNET NSG Rules](https://user-images.githubusercontent.com/33844181/176845738-cd4eaaa4-980c-4138-9aaf-2de510fb50a0.png)

Go to network security group corresponding to the subnet used to create the AMS resource. 
![NSG for Subnet](https://user-images.githubusercontent.com/33844181/176845779-f33a553f-d62e-468f-b848-59f429a03504.png)

Go to Outbound security rules tab under settings. 
![Security Rules](https://user-images.githubusercontent.com/33844181/176845815-ca7a4e4d-8b3d-43cb-ace3-8fdf31834839.png)

The below image contains the required security rules for AMS resource to work. 
![Security Roles](https://user-images.githubusercontent.com/33844181/176845846-44bbcb1a-4b86-4158-afa8-0eebd1378655.png)

550: Allow the source IP for making calls to source system to be monitored. 
600: Allow the source IP for making calls AzureResourceManager service tag. 
650: Allow the source IP to access key-vault resource using private endpoint IP. 
700: Allow the source IP to access storage-account resources using private endpoint IP. (Include IPs for each of storage account sub resources: table, queue, file, and blob) 
800: Allow the source IP to access log-analytics workspace resource using private endpoint IP. 
