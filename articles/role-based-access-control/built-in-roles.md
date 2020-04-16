---
title: Azure built-in roles for Azure RBAC
description: This article describes the Azure built-in roles for Azure role-based access control (RBAC). It lists Actions, NotActions, DataActions, and NotDataActions.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: role-based-access-control
ms.devlang:
ms.topic: reference
ms.tgt_pltfrm:
ms.workload: identity
ms.date: 03/22/2020
ms.author: rolyon
ms.reviewer: bagovind

ms.custom: it-pro
---
# Azure built-in roles

[Azure role-based access control (RBAC)](overview.md) has several Azure built-in roles that you can assign to users, groups, service principals, and managed identities. Role assignments are the way you control access to Azure resources. If the built-in roles don't meet the specific needs of your organization, you can create your own [Azure custom roles](custom-roles.md).

This article lists the built-in roles for Azure resources, which are always evolving. To get the latest roles, use [Get-AzRoleDefinition](/powershell/module/az.resources/get-azroledefinition) or [az role definition list](/cli/azure/role/definition#az-role-definition-list). If you are looking for administrator roles for Azure Active Directory (Azure AD), see [Administrator role permissions in Azure Active Directory](../active-directory/users-groups-roles/directory-assign-admin-roles.md).

## All

The following table provides a brief description and the unique ID of each built-in role. Select the role name to see the list of `Actions`, `NotActions`, `DataActions`, and `NotDataActions` for each role. For information about what these actions mean and how they apply to the management and data planes, see [Understand role definitions for Azure resources](role-definitions.md).


> [!div class="mx-tableFixed"]
> | Built-in role | Description | ID |
> | --- | --- | --- |
> | **General** |  |  |
> | [Contributor](#contributor) | Lets you manage everything except granting access to resources. | b24988ac-6180-42a0-ab88-20f7382dd24c |
> | [Owner](#owner) | Lets you manage everything, including access to resources. | 8e3af657-a8ff-443c-a75c-2fe8c4bcb635 |
> | [Reader](#reader) | Lets you view everything, but not make any changes. | acdd72a7-3385-48ef-bd42-f606fba81ae7 |
> | [User Access Administrator](#user-access-administrator) | Lets you manage user access to Azure resources. | 18d7d88d-d35e-4fb5-a5c3-7773c20a72d9 |
> | **Compute** |  |  |
> | [Classic Virtual Machine Contributor](#classic-virtual-machine-contributor) | Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to. | d73bb868-a0df-4d4d-bd69-98a00b01fccb |
> | [Virtual Machine Administrator Login](#virtual-machine-administrator-login) | View Virtual Machines in the portal and login as administrator | 1c0163c0-47e6-4577-8991-ea5c82e286e4 |
> | [Virtual Machine Contributor](#virtual-machine-contributor) | Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to. | 9980e02c-c2be-4d73-94e8-173b1dc7cf3c |
> | [Virtual Machine User Login](#virtual-machine-user-login) | View Virtual Machines in the portal and login as a regular user. | fb879df8-f326-4884-b1cf-06f3ad86be52 |
> | **Networking** |  |  |
> | [CDN Endpoint Contributor](#cdn-endpoint-contributor) | Can manage CDN endpoints, but can't grant access to other users. | 426e0c7f-0c7e-4658-b36f-ff54d6c29b45 |
> | [CDN Endpoint Reader](#cdn-endpoint-reader) | Can view CDN endpoints, but can't make changes. | 871e35f6-b5c1-49cc-a043-bde969a0f2cd |
> | [CDN Profile Contributor](#cdn-profile-contributor) | Can manage CDN profiles and their endpoints, but can't grant access to other users. | ec156ff8-a8d1-4d15-830c-5b80698ca432 |
> | [CDN Profile Reader](#cdn-profile-reader) | Can view CDN profiles and their endpoints, but can't make changes. | 8f96442b-4075-438f-813d-ad51ab4019af |
> | [Classic Network Contributor](#classic-network-contributor) | Lets you manage classic networks, but not access to them. | b34d265f-36f7-4a0d-a4d4-e158ca92e90f |
> | [DNS Zone Contributor](#dns-zone-contributor) | Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them. | befefa01-2a29-4197-83a8-272ff33ce314 |
> | [Network Contributor](#network-contributor) | Lets you manage networks, but not access to them. | 4d97b98b-1d4f-4787-a291-c67834d212e7 |
> | [Traffic Manager Contributor](#traffic-manager-contributor) | Lets you manage Traffic Manager profiles, but does not let you control who has access to them. | a4b10055-b0c7-44c2-b00f-c7b5b3550cf7 |
> | **Storage** |  |  |
> | [Avere Contributor](#avere-contributor) | Can create and manage an Avere vFXT cluster. | 4f8fab4f-1852-4a58-a46a-8eaf358af14a |
> | [Avere Operator](#avere-operator) | Used by the Avere vFXT cluster to manage the cluster | c025889f-8102-4ebf-b32c-fc0c6f0c6bd9 |
> | [Backup Contributor](#backup-contributor) | Lets you manage backup service, but can't create vaults and give access to others | 5e467623-bb1f-42f4-a55d-6e525e11384b |
> | [Backup Operator](#backup-operator) | Lets you manage backup services, except removal of backup, vault creation and giving access to others | 00c29273-979b-4161-815c-10b084fb9324 |
> | [Backup Reader](#backup-reader) | Can view backup services, but can't make changes | a795c7a0-d4a2-40c1-ae25-d81f01202912 |
> | [Classic Storage Account Contributor](#classic-storage-account-contributor) | Lets you manage classic storage accounts, but not access to them. | 86e8f5dc-a6e9-4c67-9d15-de283e8eac25 |
> | [Classic Storage Account Key Operator Service Role](#classic-storage-account-key-operator-service-role) | Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts | 985d6b00-f706-48f5-a6fe-d0ca12fb668d |
> | [Data Box Contributor](#data-box-contributor) | Lets you manage everything under Data Box Service except giving access to others. | add466c9-e687-43fc-8d98-dfcf8d720be5 |
> | [Data Box Reader](#data-box-reader) | Lets you manage Data Box Service except creating order or editing order details and giving access to others. | 028f4ed7-e2a9-465e-a8f4-9c0ffdfdc027 |
> | [Data Lake Analytics Developer](#data-lake-analytics-developer) | Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts. | 47b7735b-770e-4598-a7da-8b91488b4c88 |
> | [Reader and Data Access](#reader-and-data-access) | Lets you view everything but will not let you delete or create a storage account or contained resource. It will also allow read/write access to all data contained in a storage account via access to storage account keys. | c12c1c16-33a1-487b-954d-41c89c60f349 |
> | [Storage Account Contributor](#storage-account-contributor) | Permits management of storage accounts. Provides access to the account key, which can be used to access data via Shared Key authorization. | 17d1049b-9a84-46fb-8f53-869881c3d3ab |
> | [Storage Account Key Operator Service Role](#storage-account-key-operator-service-role) | Permits listing and regenerating storage account access keys. | 81a9662b-bebf-436f-a333-f67b29880f12 |
> | [Storage Blob Data Contributor](#storage-blob-data-contributor) | Read, write, and delete Azure Storage containers and blobs. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | ba92f5b4-2d11-453d-a403-e96b0029c9fe |
> | [Storage Blob Data Owner](#storage-blob-data-owner) | Provides full access to Azure Storage blob containers and data, including assigning POSIX access control. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | b7e6dc6d-f1e8-4753-8033-0f276bb0955b |
> | [Storage Blob Data Reader](#storage-blob-data-reader) | Read and list Azure Storage containers and blobs. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | 2a2b9908-6ea1-4ae2-8e65-a410df84e7d1 |
> | [Storage Blob Delegator](#storage-blob-delegator) | Get a user delegation key, which can then be used to create a shared access signature for a container or blob that is signed with Azure AD credentials. For more information, see [Create a user delegation SAS](https://docs.microsoft.com/rest/api/storageservices/create-user-delegation-sas). | db58b8e5-c6ad-4a2a-8342-4190687cbf4a |
> | [Storage File Data SMB Share Contributor](#storage-file-data-smb-share-contributor) | Allows for read, write, and delete access on files/directories in Azure file shares. This role has no built-in equivalent on Windows file servers. | 0c867c2a-1d8c-454a-a3db-ab2ea1bdc8bb |
> | [Storage File Data SMB Share Elevated Contributor](#storage-file-data-smb-share-elevated-contributor) | Allows for read, write, delete, and modify ACLs on files/directories in Azure file shares. This role is equivalent to a file share ACL of change on Windows file servers. | a7264617-510b-434b-a828-9731dc254ea7 |
> | [Storage File Data SMB Share Reader](#storage-file-data-smb-share-reader) | Allows for read access on files/directories in Azure file shares. This role is equivalent to a file share ACL of read on  Windows file servers. | aba4ae5f-2193-4029-9191-0cb91df5e314 |
> | [Storage Queue Data Contributor](#storage-queue-data-contributor) | Read, write, and delete Azure Storage queues and queue messages. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | 974c5e8b-45b9-4653-ba55-5f855dd0fb88 |
> | [Storage Queue Data Message Processor](#storage-queue-data-message-processor) | Peek, retrieve, and delete a message from an Azure Storage queue. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | 8a0f0c08-91a1-4084-bc3d-661d67233fed |
> | [Storage Queue Data Message Sender](#storage-queue-data-message-sender) | Add messages to an Azure Storage queue. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | c6a89b2d-59bc-44d0-9896-0f6e12d7b80a |
> | [Storage Queue Data Reader](#storage-queue-data-reader) | Read and list Azure Storage queues and queue messages. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations). | 19e7f393-937e-4f77-808e-94535e297925 |
> | **Web** |  |  |
> | [Azure Maps Data Reader (Preview)](#azure-maps-data-reader-preview) | Grants access to read map related data from an Azure maps account. | 423170ca-a8f6-4b0f-8487-9e4eb8f49bfa |
> | [Search Service Contributor](#search-service-contributor) | Lets you manage Search services, but not access to them. | 7ca78c08-252a-4471-8644-bb5ff32d4ba0 |
> | [Web Plan Contributor](#web-plan-contributor) | Lets you manage the web plans for websites, but not access to them. | 2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b |
> | [Website Contributor](#website-contributor) | Lets you manage websites (not web plans), but not access to them. | de139f84-1756-47ae-9be6-808fbbe84772 |
> | **Containers** |  |  |
> | [AcrDelete](#acrdelete) | acr delete | c2f4ef07-c644-48eb-af81-4b1b4947fb11 |
> | [AcrImageSigner](#acrimagesigner) | acr image signer | 6cef56e8-d556-48e5-a04f-b8e64114680f |
> | [AcrPull](#acrpull) | acr pull | 7f951dda-4ed3-4680-a7ca-43fe172d538d |
> | [AcrPush](#acrpush) | acr push | 8311e382-0749-4cb8-b61a-304f252e45ec |
> | [AcrQuarantineReader](#acrquarantinereader) | acr quarantine data reader | cdda3590-29a3-44f6-95f2-9f980659eb04 |
> | [AcrQuarantineWriter](#acrquarantinewriter) | acr quarantine data writer | c8d4ff99-41c3-41a8-9f60-21dfdad59608 |
> | [Azure Kubernetes Service Cluster Admin Role](#azure-kubernetes-service-cluster-admin-role) | List cluster admin credential action. | 0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8 |
> | [Azure Kubernetes Service Cluster User Role](#azure-kubernetes-service-cluster-user-role) | List cluster user credential action. | 4abbcc35-e782-43d8-92c5-2d3f1bd2253f |
> | **Databases** |  |  |
> | [Cosmos DB Account Reader Role](#cosmos-db-account-reader-role) | Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts. | fbdf93bf-df7d-467e-a4d2-9458aa1360c8 |
> | [Cosmos DB Operator](#cosmos-db-operator) | Lets you manage Azure Cosmos DB accounts, but not access data in them. Prevents access to account keys and connection strings. | 230815da-be43-4aae-9cb4-875f7bd000aa |
> | [CosmosBackupOperator](#cosmosbackupoperator) | Can submit restore request for a Cosmos DB database or a container for an account | db7b14f2-5adf-42da-9f96-f2ee17bab5cb |
> | [DocumentDB Account Contributor](#documentdb-account-contributor) | Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB. | 5bd9cd88-fe45-4216-938b-f97437e15450 |
> | [Redis Cache Contributor](#redis-cache-contributor) | Lets you manage Redis caches, but not access to them. | e0f68234-74aa-48ed-b826-c38b57376e17 |
> | [SQL DB Contributor](#sql-db-contributor) | Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers. | 9b7fa17d-e63e-47b0-bb0a-15c516ac86ec |
> | [SQL Managed Instance Contributor](#sql-managed-instance-contributor) | Lets you manage SQL Managed Instances and required network configuration, but can't give access to others. | 4939a1f6-9ae0-4e48-a1e0-f2cbe897382d |
> | [SQL Security Manager](#sql-security-manager) | Lets you manage the security-related policies of SQL servers and databases, but not access to them. | 056cd41c-7e88-42e1-933e-88ba6a50c9c3 |
> | [SQL Server Contributor](#sql-server-contributor) | Lets you manage SQL servers and databases, but not access to them, and not their security-related policies. | 6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437 |
> | **Analytics** |  |  |
> | [Azure Event Hubs Data Owner](#azure-event-hubs-data-owner) | Allows for full access to Azure Event Hubs resources. | f526a384-b230-433a-b45c-95f59c4a2dec |
> | [Azure Event Hubs Data Receiver](#azure-event-hubs-data-receiver) | Allows receive access to Azure Event Hubs resources. | a638d3c7-ab3a-418d-83e6-5f17a39d4fde |
> | [Azure Event Hubs Data Sender](#azure-event-hubs-data-sender) | Allows send access to Azure Event Hubs resources. | 2b629674-e913-4c01-ae53-ef4638d8f975 |
> | [Data Factory Contributor](#data-factory-contributor) | Create and manage data factories, as well as child resources within them. | 673868aa-7521-48a0-acc6-0f60742d39f5 |
> | [Data Purger](#data-purger) | Can purge analytics data | 150f5e0c-0603-4f03-8c7f-cf70034c4e90 |
> | [HDInsight Cluster Operator](#hdinsight-cluster-operator) | Lets you read and modify HDInsight cluster configurations. | 61ed4efc-fab3-44fd-b111-e24485cc132a |
> | [HDInsight Domain Services Contributor](#hdinsight-domain-services-contributor) | Can Read, Create, Modify and Delete Domain Services related operations needed for HDInsight Enterprise Security Package | 8d8d5a11-05d3-4bda-a417-a08778121c7c |
> | [Log Analytics Contributor](#log-analytics-contributor) | Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; creating and configuring Automation accounts; adding solutions; and configuring Azure diagnostics on all Azure resources. | 92aaf0da-9dab-42b6-94a3-d43ce8d16293 |
> | [Log Analytics Reader](#log-analytics-reader) | Log Analytics Reader can view and search all monitoring data as well as and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources. | 73c42c96-874c-492b-b04d-ab87d138a893 |
> | **Blockchain** |  |  |
> | [Blockchain Member Node Access (Preview)](#blockchain-member-node-access-preview) | Allows for access to Blockchain Member nodes | 31a002a1-acaf-453e-8a5b-297c9ca1ea24 |
> | **AI + machine learning** |  |  |
> | [Cognitive Services Contributor](#cognitive-services-contributor) | Lets you create, read, update, delete and manage keys of Cognitive Services. | 25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68 |
> | [Cognitive Services Data Reader (Preview)](#cognitive-services-data-reader-preview) | Lets you read Cognitive Services data. | b59867f0-fa02-499b-be73-45a86b5b3e1c |
> | [Cognitive Services User](#cognitive-services-user) | Lets you read and list keys of Cognitive Services. | a97b65f3-24c7-4388-baec-2e87135dc908 |
> | **Mixed reality** |  |  |
> | [Spatial Anchors Account Contributor](#spatial-anchors-account-contributor) | Lets you manage spatial anchors in your account, but not delete them | 8bbe83f1-e2a6-4df7-8cb4-4e04d4e5c827 |
> | [Spatial Anchors Account Owner](#spatial-anchors-account-owner) | Lets you manage spatial anchors in your account, including deleting them | 70bbe301-9835-447d-afdd-19eb3167307c |
> | [Spatial Anchors Account Reader](#spatial-anchors-account-reader) | Lets you locate and read properties of spatial anchors in your account | 5d51204f-eb77-4b1c-b86a-2ec626c49413 |
> | **Integration** |  |  |
> | [API Management Service Contributor](#api-management-service-contributor) | Can manage service and the APIs | 312a565d-c81f-4fd8-895a-4e21e48d571c |
> | [API Management Service Operator Role](#api-management-service-operator-role) | Can manage service but not the APIs | e022efe7-f5ba-4159-bbe4-b44f577e9b61 |
> | [API Management Service Reader Role](#api-management-service-reader-role) | Read-only access to service and APIs | 71522526-b88f-4d52-b57f-d31fc3546d0d |
> | [App Configuration Data Owner](#app-configuration-data-owner) | Allows full access to App Configuration data. | 5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b |
> | [App Configuration Data Reader](#app-configuration-data-reader) | Allows read access to App Configuration data. | 516239f1-63e1-4d78-a4de-a74fb236a071 |
> | [Azure Service Bus Data Owner](#azure-service-bus-data-owner) | Allows for full access to Azure Service Bus resources. | 090c5cfd-751d-490a-894a-3ce6f1109419 |
> | [Azure Service Bus Data Receiver](#azure-service-bus-data-receiver) | Allows for receive access to Azure Service Bus resources. | 4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0 |
> | [Azure Service Bus Data Sender](#azure-service-bus-data-sender) | Allows for send access to Azure Service Bus resources. | 69a216fc-b8fb-44d8-bc22-1f3c2cd27a39 |
> | [Azure Stack Registration Owner](#azure-stack-registration-owner) | Lets you manage Azure Stack registrations. | 6f12a6df-dd06-4f3e-bcb1-ce8be600526a |
> | [EventGrid EventSubscription Contributor](#eventgrid-eventsubscription-contributor) | Lets you manage EventGrid event subscription operations. | 428e0ff0-5e57-4d9c-a221-2c70d0e0a443 |
> | [EventGrid EventSubscription Reader](#eventgrid-eventsubscription-reader) | Lets you read EventGrid event subscriptions. | 2414bbcf-6497-4faf-8c65-045460748405 |
> | [Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) | Lets you manage Intelligent Systems accounts, but not access to them. | 03a6d094-3444-4b3d-88af-7477090a9e5e |
> | [Logic App Contributor](#logic-app-contributor) | Lets you manage logic apps, but not change access to them. | 87a39d53-fc1b-424a-814c-f7e04687dc9e |
> | [Logic App Operator](#logic-app-operator) | Lets you read, enable, and disable logic apps, but not edit or update them. | 515c2055-d9d4-4321-b1b9-bd0c9a0f79fe |
> | **Identity** |  |  |
> | [Managed Identity Contributor](#managed-identity-contributor) | Create, Read, Update, and Delete User Assigned Identity | e40ec5ca-96e0-45a2-b4ff-59039f2c2b59 |
> | [Managed Identity Operator](#managed-identity-operator) | Read and Assign User Assigned Identity | f1a07417-d97a-45cb-824c-7a7467783830 |
> | **Security** |  |  |
> | [Azure Sentinel Contributor](#azure-sentinel-contributor) | Azure Sentinel Contributor | ab8e14d6-4a74-4a29-9ba8-549422addade |
> | [Azure Sentinel Reader](#azure-sentinel-reader) | Azure Sentinel Reader | 8d289c81-5878-46d4-8554-54e1e3d8b5cb |
> | [Azure Sentinel Responder](#azure-sentinel-responder) | Azure Sentinel Responder | 3e150937-b8fe-4cfb-8069-0eaf05ecd056 |
> | [Key Vault Contributor](#key-vault-contributor) | Lets you manage key vaults, but not access to them. | f25e0fa2-a7c8-4377-a976-54943a77a395 |
> | [Security Admin](#security-admin) | Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations. | fb1c8493-542b-48eb-b624-b4c8fea62acd |
> | [Security Assessment Contributor](#security-assessment-contributor) | Lets you push assessments to Security Center | 612c2aa1-cb24-443b-ac28-3ab7272de6f5 |
> | [Security Manager (Legacy)](#security-manager-legacy) | This is a legacy role. Please use Security Admin instead. | e3d13bf0-dd5a-482e-ba6b-9b8433878d10 |
> | [Security Reader](#security-reader) | Can view recommendations and alerts, view security policies, view security states, but cannot make changes. | 39bc4728-0917-49c7-9d2c-d95423bc2eb4 |
> | **DevOps** |  |  |
> | [DevTest Labs User](#devtest-labs-user) | Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs. | 76283e04-6283-4c54-8f91-bcf1374a3c64 |
> | [Lab Creator](#lab-creator) | Lets you create, manage, delete your managed labs under your Azure Lab Accounts. | b97fb8bc-a8b2-4522-a38b-dd33c7e65ead |
> | **Monitor** |  |  |
> | [Application Insights Component Contributor](#application-insights-component-contributor) | Can manage Application Insights components | ae349356-3a1b-4a5e-921d-050484c6347e |
> | [Application Insights Snapshot Debugger](#application-insights-snapshot-debugger) | Gives user permission to view and download debug snapshots collected with the Application Insights Snapshot Debugger. Note that these permissions are not included in the [Owner](#owner) or [Contributor](#contributor) roles. | 08954f03-6346-4c2e-81c0-ec3a5cfae23b |
> | [Monitoring Contributor](#monitoring-contributor) | Can read all monitoring data and edit monitoring settings. See also [Get started with roles, permissions, and security with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security#built-in-monitoring-roles). | 749f88d5-cbae-40b8-bcfc-e573ddc772fa |
> | [Monitoring Metrics Publisher](#monitoring-metrics-publisher) | Enables publishing metrics against Azure resources | 3913510d-42f4-4e42-8a64-420c390055eb |
> | [Monitoring Reader](#monitoring-reader) | Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security#built-in-monitoring-roles). | 43d0d8ad-25c7-4714-9337-8ba259a9fe05 |
> | [Workbook Contributor](#workbook-contributor) | Can save shared workbooks. | e8ddcd69-c73f-4f9f-9844-4100522f16ad |
> | [Workbook Reader](#workbook-reader) | Can read workbooks. | b279062a-9be3-42a0-92ae-8b3cf002ec4d |
> | **Management + governance** |  |  |
> | [Automation Job Operator](#automation-job-operator) | Create and Manage Jobs using Automation Runbooks. | 4fe576fe-1146-4730-92eb-48519fa6bf9f |
> | [Automation Operator](#automation-operator) | Automation Operators are able to start, stop, suspend, and resume jobs | d3881f73-407a-4167-8283-e981cbba0404 |
> | [Automation Runbook Operator](#automation-runbook-operator) | Read Runbook properties - to be able to create Jobs of the runbook. | 5fb5aef8-1081-4b8e-bb16-9d5d0385bab5 |
> | [Azure Connected Machine Onboarding](#azure-connected-machine-onboarding) | Can onboard Azure Connected Machines. | b64e21ea-ac4e-4cdf-9dc9-5b892992bee7 |
> | [Azure Connected Machine Resource Administrator](#azure-connected-machine-resource-administrator) | Can read, write, delete and re-onboard Azure Connected Machines. | cd570a14-e51a-42ad-bac8-bafd67325302 |
> | [Billing Reader](#billing-reader) | Allows read access to billing data | fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64 |
> | [Blueprint Contributor](#blueprint-contributor) | Can manage blueprint definitions, but not assign them. | 41077137-e803-4205-871c-5a86e6a753b4 |
> | [Blueprint Operator](#blueprint-operator) | Can assign existing published blueprints, but cannot create new blueprints. Note that this only works if the assignment is done with a user-assigned managed identity. | 437d2ced-4a38-4302-8479-ed2bcb43d090 |
> | [Cost Management Contributor](#cost-management-contributor) | Can view costs and manage cost configuration (e.g. budgets, exports) | 434105ed-43f6-45c7-a02f-909b2ba83430 |
> | [Cost Management Reader](#cost-management-reader) | Can view cost data and configuration (e.g. budgets, exports) | 72fafb9e-0641-4937-9268-a91bfd8191a3 |
> | [Managed Application Contributor Role](#managed-application-contributor-role) | Allows for creating managed application resources. | 641177b8-a67a-45b9-a033-47bc880bb21e |
> | [Managed Application Operator Role](#managed-application-operator-role) | Lets you read and perform actions on Managed Application resources | c7393b34-138c-406f-901b-d8cf2b17e6ae |
> | [Managed Applications Reader](#managed-applications-reader) | Lets you read resources in a managed app and request JIT access. | b9331d33-8a36-4f8c-b097-4f54124fdb44 |
> | [Managed Services Registration assignment Delete Role](#managed-services-registration-assignment-delete-role) | Managed Services Registration Assignment Delete Role allows the managing tenant users to delete the registration assignment assigned to their tenant. | 91c1777a-f3dc-4fae-b103-61d183457e46 |
> | [Management Group Contributor](#management-group-contributor) | Management Group Contributor Role | 5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c |
> | [Management Group Reader](#management-group-reader) | Management Group Reader Role | ac63b705-f282-497d-ac71-919bf39d939d |
> | [New Relic APM Account Contributor](#new-relic-apm-account-contributor) | Lets you manage New Relic Application Performance Management accounts and applications, but not access to them. | 5d28c62d-5b37-4476-8438-e587778df237 |
> | [Policy Insights Data Writer (Preview)](#policy-insights-data-writer-preview) | Allows read access to resource policies and write access to resource component policy events. | 66bb4e9e-b016-4a94-8249-4c0511c2be84 |
> | [Resource Policy Contributor](#resource-policy-contributor) | Users with rights to create/modify resource policy, create support ticket and read resources/hierarchy. | 36243c78-bf99-498c-9df9-86d9f8d28608 |
> | [Site Recovery Contributor](#site-recovery-contributor) | Lets you manage Site Recovery service except vault creation and role assignment | 6670b86e-a3f7-4917-ac9b-5d6ab1be4567 |
> | [Site Recovery Operator](#site-recovery-operator) | Lets you failover and failback but not perform other Site Recovery management operations | 494ae006-db33-4328-bf46-533a6560a3ca |
> | [Site Recovery Reader](#site-recovery-reader) | Lets you view Site Recovery status but not perform other management operations | dbaa88c4-0c30-4179-9fb3-46319faa6149 |
> | [Support Request Contributor](#support-request-contributor) | Lets you create and manage Support requests | cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e |
> | [Tag Contributor](#tag-contributor) | Lets you manage tags on entities, without providing access to the entities themselves. | 4a9ae827-6dc8-4573-8ac7-8239d42aa03f |
> | **Other** |  |  |
> | [BizTalk Contributor](#biztalk-contributor) | Lets you manage BizTalk services, but not access to them. | 5e3c6656-6cfa-4708-81fe-0de47ac73342 |
> | [Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) | Lets you manage Scheduler job collections, but not access to them. | 188a0f2f-5c9e-469b-ae67-2aa5ce574b94 |


## General


### Contributor

Lets you manage everything except granting access to resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | * | Create and manage resources of all types |
> | **NotActions** |  |
> | Microsoft.Authorization/*/Delete | Delete roles, policy assignments, policy definitions and policy set definitions |
> | Microsoft.Authorization/*/Write | Create roles, role assignments, policy assignments, policy definitions and policy set definitions |
> | Microsoft.Authorization/elevateAccess/Action | Grants the caller User Access Administrator access at the tenant scope |
> | Microsoft.Blueprint/blueprintAssignments/write | Create or update any blueprint assignments |
> | Microsoft.Blueprint/blueprintAssignments/delete | Delete any blueprint assignments |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage everything except access to resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
  "name": "b24988ac-6180-42a0-ab88-20f7382dd24c",
  "permissions": [
    {
      "actions": [
        "*"
      ],
      "notActions": [
        "Microsoft.Authorization/*/Delete",
        "Microsoft.Authorization/*/Write",
        "Microsoft.Authorization/elevateAccess/Action",
        "Microsoft.Blueprint/blueprintAssignments/write",
        "Microsoft.Blueprint/blueprintAssignments/delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Owner

Lets you manage everything, including access to resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | * | Create and manage resources of all types |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage everything, including access to resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
  "name": "8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
  "permissions": [
    {
      "actions": [
        "*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Reader

Lets you view everything, but not make any changes.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you view everything, but not make any changes.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/acdd72a7-3385-48ef-bd42-f606fba81ae7",
  "name": "acdd72a7-3385-48ef-bd42-f606fba81ae7",
  "permissions": [
    {
      "actions": [
        "*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### User Access Administrator

Lets you manage user access to Azure resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.Authorization/* | Manage authorization |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage user access to Azure resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
  "name": "18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Authorization/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "User Access Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Compute


### Classic Virtual Machine Contributor

Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ClassicCompute/domainNames/* | Create and manage classic compute domain names |
> | Microsoft.ClassicCompute/virtualMachines/* | Create and manage virtual machines |
> | Microsoft.ClassicNetwork/networkSecurityGroups/join/action |  |
> | Microsoft.ClassicNetwork/reservedIps/link/action | Link a reserved Ip |
> | Microsoft.ClassicNetwork/reservedIps/read | Gets the reserved Ips |
> | Microsoft.ClassicNetwork/virtualNetworks/join/action | Joins the virtual network. |
> | Microsoft.ClassicNetwork/virtualNetworks/read | Get the virtual network. |
> | Microsoft.ClassicStorage/storageAccounts/disks/read | Returns the storage account disk. |
> | Microsoft.ClassicStorage/storageAccounts/images/read | Returns the storage account image. (Deprecated. Use 'Microsoft.ClassicStorage/storageAccounts/vmImages') |
> | Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/d73bb868-a0df-4d4d-bd69-98a00b01fccb",
  "name": "d73bb868-a0df-4d4d-bd69-98a00b01fccb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicCompute/domainNames/*",
        "Microsoft.ClassicCompute/virtualMachines/*",
        "Microsoft.ClassicNetwork/networkSecurityGroups/join/action",
        "Microsoft.ClassicNetwork/reservedIps/link/action",
        "Microsoft.ClassicNetwork/reservedIps/read",
        "Microsoft.ClassicNetwork/virtualNetworks/join/action",
        "Microsoft.ClassicNetwork/virtualNetworks/read",
        "Microsoft.ClassicStorage/storageAccounts/disks/read",
        "Microsoft.ClassicStorage/storageAccounts/images/read",
        "Microsoft.ClassicStorage/storageAccounts/listKeys/action",
        "Microsoft.ClassicStorage/storageAccounts/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Classic Virtual Machine Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Virtual Machine Administrator Login

View Virtual Machines in the portal and login as administrator

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
> | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Microsoft.Compute/virtualMachines/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Compute/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | Microsoft.Compute/virtualMachines/loginAsAdmin/action | Log in to a virtual machine with Windows administrator or Linux root user privileges |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View Virtual Machines in the portal and login as administrator",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/1c0163c0-47e6-4577-8991-ea5c82e286e4",
  "name": "1c0163c0-47e6-4577-8991-ea5c82e286e4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Compute/virtualMachines/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Compute/virtualMachines/login/action",
        "Microsoft.Compute/virtualMachines/loginAsAdmin/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine Administrator Login",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Virtual Machine Contributor

Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Compute/availabilitySets/* | Create and manage compute availability sets |
> | Microsoft.Compute/locations/* | Create and manage compute locations |
> | Microsoft.Compute/virtualMachines/* | Create and manage virtual machines |
> | Microsoft.Compute/virtualMachineScaleSets/* | Create and manage virtual machine scale sets |
> | Microsoft.Compute/disks/write | Creates a new Disk or updates an existing one |
> | Microsoft.Compute/disks/read | Get the properties of a Disk |
> | Microsoft.Compute/disks/delete | Deletes the Disk |
> | Microsoft.DevTestLab/schedules/* |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/applicationGateways/backendAddressPools/join/action | Joins an application gateway backend address pool. Not Alertable. |
> | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | Microsoft.Network/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound NAT pool. Not alertable. |
> | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. Not alertable. |
> | Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
> | Microsoft.Network/locations/* | Create and manage network locations |
> | Microsoft.Network/networkInterfaces/* | Create and manage network interfaces |
> | Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | Microsoft.Network/networkSecurityGroups/read | Gets a network security group definition |
> | Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address. Not Alertable. |
> | Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.RecoveryServices/locations/* |  |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/*/read |  |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/write | Creates Protection Policy |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.SqlVirtualMachine/* |  |
> | Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
  "name": "9980e02c-c2be-4d73-94e8-173b1dc7cf3c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Compute/availabilitySets/*",
        "Microsoft.Compute/locations/*",
        "Microsoft.Compute/virtualMachines/*",
        "Microsoft.Compute/virtualMachineScaleSets/*",
        "Microsoft.Compute/disks/write",
        "Microsoft.Compute/disks/read",
        "Microsoft.Compute/disks/delete",
        "Microsoft.DevTestLab/schedules/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/applicationGateways/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
        "Microsoft.Network/loadBalancers/probes/join/action",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/locations/*",
        "Microsoft.Network/networkInterfaces/*",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Network/networkSecurityGroups/read",
        "Microsoft.Network/publicIPAddresses/join/action",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.RecoveryServices/locations/*",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/*/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/write",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/write",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.SqlVirtualMachine/*",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Virtual Machine User Login

View Virtual Machines in the portal and login as a regular user.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
> | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Microsoft.Compute/virtualMachines/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Compute/virtualMachines/login/action | Log in to a virtual machine as a regular user |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "View Virtual Machines in the portal and login as a regular user.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/fb879df8-f326-4884-b1cf-06f3ad86be52",
  "name": "fb879df8-f326-4884-b1cf-06f3ad86be52",
  "permissions": [
    {
      "actions": [
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/loadBalancers/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Compute/virtualMachines/*/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Compute/virtualMachines/login/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Virtual Machine User Login",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Networking


### CDN Endpoint Contributor

Can manage CDN endpoints, but can't grant access to other users.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Cdn/edgenodes/read |  |
> | Microsoft.Cdn/operationresults/* |  |
> | Microsoft.Cdn/profiles/endpoints/* |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage CDN endpoints, but can't grant access to other users.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/426e0c7f-0c7e-4658-b36f-ff54d6c29b45",
  "name": "426e0c7f-0c7e-4658-b36f-ff54d6c29b45",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/endpoints/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CDN Endpoint Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### CDN Endpoint Reader

Can view CDN endpoints, but can't make changes.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Cdn/edgenodes/read |  |
> | Microsoft.Cdn/operationresults/* |  |
> | Microsoft.Cdn/profiles/endpoints/*/read |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can view CDN endpoints, but can't make changes.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/871e35f6-b5c1-49cc-a043-bde969a0f2cd",
  "name": "871e35f6-b5c1-49cc-a043-bde969a0f2cd",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/endpoints/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CDN Endpoint Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### CDN Profile Contributor

Can manage CDN profiles and their endpoints, but can't grant access to other users.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Cdn/edgenodes/read |  |
> | Microsoft.Cdn/operationresults/* |  |
> | Microsoft.Cdn/profiles/* |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage CDN profiles and their endpoints, but can't grant access to other users.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ec156ff8-a8d1-4d15-830c-5b80698ca432",
  "name": "ec156ff8-a8d1-4d15-830c-5b80698ca432",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CDN Profile Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### CDN Profile Reader

Can view CDN profiles and their endpoints, but can't make changes.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Cdn/edgenodes/read |  |
> | Microsoft.Cdn/operationresults/* |  |
> | Microsoft.Cdn/profiles/*/read |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can view CDN profiles and their endpoints, but can't make changes.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8f96442b-4075-438f-813d-ad51ab4019af",
  "name": "8f96442b-4075-438f-813d-ad51ab4019af",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cdn/edgenodes/read",
        "Microsoft.Cdn/operationresults/*",
        "Microsoft.Cdn/profiles/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CDN Profile Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Classic Network Contributor

Lets you manage classic networks, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ClassicNetwork/* | Create and manage classic networks |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage classic networks, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b34d265f-36f7-4a0d-a4d4-e158ca92e90f",
  "name": "b34d265f-36f7-4a0d-a4d4-e158ca92e90f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicNetwork/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Classic Network Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### DNS Zone Contributor

Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/dnsZones/* | Create and manage DNS zones and records |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/befefa01-2a29-4197-83a8-272ff33ce314",
  "name": "befefa01-2a29-4197-83a8-272ff33ce314",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/dnsZones/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "DNS Zone Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Network Contributor

Lets you manage networks, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/* | Create and manage networks |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage networks, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4d97b98b-1d4f-4787-a291-c67834d212e7",
  "name": "4d97b98b-1d4f-4787-a291-c67834d212e7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Network Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Traffic Manager Contributor

Lets you manage Traffic Manager profiles, but does not let you control who has access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/trafficManagerProfiles/* |  |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Traffic Manager profiles, but does not let you control who has access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/a4b10055-b0c7-44c2-b00f-c7b5b3550cf7",
  "name": "a4b10055-b0c7-44c2-b00f-c7b5b3550cf7",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/trafficManagerProfiles/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Traffic Manager Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Storage


### Avere Contributor

Can create and manage an Avere vFXT cluster.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Compute/*/read |  |
> | Microsoft.Compute/availabilitySets/* |  |
> | Microsoft.Compute/virtualMachines/* |  |
> | Microsoft.Compute/disks/* |  |
> | Microsoft.Network/*/read |  |
> | Microsoft.Network/networkInterfaces/* |  |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/*/read |  |
> | Microsoft.Storage/storageAccounts/* | Create and manage storage accounts |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Resources/subscriptions/resourceGroups/resources/read | Gets the resources for the resource group. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | Returns the result of deleting a blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Returns a blob or a list of blobs |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Returns the result of writing a blob |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can create and manage an Avere vFXT cluster.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4f8fab4f-1852-4a58-a46a-8eaf358af14a",
  "name": "4f8fab4f-1852-4a58-a46a-8eaf358af14a",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Compute/*/read",
        "Microsoft.Compute/availabilitySets/*",
        "Microsoft.Compute/virtualMachines/*",
        "Microsoft.Compute/disks/*",
        "Microsoft.Network/*/read",
        "Microsoft.Network/networkInterfaces/*",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/*/read",
        "Microsoft.Storage/storageAccounts/*",
        "Microsoft.Support/*",
        "Microsoft.Resources/subscriptions/resourceGroups/resources/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Avere Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Avere Operator

Used by the Avere vFXT cluster to manage the cluster

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Microsoft.Network/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.Network/virtualNetworks/subnets/read | Gets a virtual network subnet definition |
> | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group. Not Alertable. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/blobServices/containers/delete | Returns the result of deleting a container |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Returns list of containers |
> | Microsoft.Storage/storageAccounts/blobServices/containers/write | Returns the result of put blob container |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | Returns the result of deleting a blob |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Returns a blob or a list of blobs |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Returns the result of writing a blob |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Used by the Avere vFXT cluster to manage the cluster",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/c025889f-8102-4ebf-b32c-fc0c6f0c6bd9",
  "name": "c025889f-8102-4ebf-b32c-fc0c6f0c6bd9",
  "permissions": [
    {
      "actions": [
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/write"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Avere Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Backup Contributor

Lets you manage backup service, but can't create vaults and give access to others

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.RecoveryServices/locations/* |  |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/* | Manage results of operation on backup management |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/* | Create and manage backup containers inside backup fabrics of Recovery Services vault |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action | Refreshes the container list |
> | Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
> | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/* | Create and manage backup policies |
> | Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
> | Microsoft.RecoveryServices/Vaults/backupProtectedItems/* | Create and manage backed up items |
> | Microsoft.RecoveryServices/Vaults/backupProtectionContainers/* | Create and manage containers holding backup items |
> | Microsoft.RecoveryServices/Vaults/backupSecurityPIN/* |  |
> | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Microsoft.RecoveryServices/Vaults/certificates/* | Create and manage certificates related to backup in Recovery Services vault |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/* |  |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/* | Create and manage registered identities |
> | Microsoft.RecoveryServices/Vaults/usages/* | Create and manage usage of Recovery Services vault |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/* |  |
> | Microsoft.RecoveryServices/Vaults/backupconfig/* |  |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/backupOperations/read | Returns Backup Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupEngines/read | Returns all the backup management servers registered with vault. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/* |  |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read | Get all protectable containers |
> | Microsoft.RecoveryServices/locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.RecoveryServices/locations/backupPreValidateProtection/action |  |
> | Microsoft.RecoveryServices/locations/backupValidateFeatures/action | Validate Features |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/write | Resolves the alert. |
> | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read | List all backup Protection Intents |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage backup service,but can't create vaults and give access to others",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5e467623-bb1f-42f4-a55d-6e525e11384b",
  "name": "5e467623-bb1f-42f4-a55d-6e525e11384b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.RecoveryServices/locations/*",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/*",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/*",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action",
        "Microsoft.RecoveryServices/Vaults/backupJobs/*",
        "Microsoft.RecoveryServices/Vaults/backupJobsExport/action",
        "Microsoft.RecoveryServices/Vaults/backupOperationResults/*",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/*",
        "Microsoft.RecoveryServices/Vaults/backupProtectableItems/*",
        "Microsoft.RecoveryServices/Vaults/backupProtectedItems/*",
        "Microsoft.RecoveryServices/Vaults/backupProtectionContainers/*",
        "Microsoft.RecoveryServices/Vaults/backupSecurityPIN/*",
        "Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read",
        "Microsoft.RecoveryServices/Vaults/certificates/*",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/*",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/read",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/*",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/*",
        "Microsoft.RecoveryServices/Vaults/usages/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.RecoveryServices/Vaults/backupstorageconfig/*",
        "Microsoft.RecoveryServices/Vaults/backupconfig/*",
        "Microsoft.RecoveryServices/Vaults/backupValidateOperation/action",
        "Microsoft.RecoveryServices/Vaults/write",
        "Microsoft.RecoveryServices/Vaults/backupOperations/read",
        "Microsoft.RecoveryServices/Vaults/backupEngines/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/*",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read",
        "Microsoft.RecoveryServices/locations/backupStatus/action",
        "Microsoft.RecoveryServices/locations/backupPreValidateProtection/action",
        "Microsoft.RecoveryServices/locations/backupValidateFeatures/action",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/write",
        "Microsoft.RecoveryServices/operations/read",
        "Microsoft.RecoveryServices/locations/operationStatus/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Backup Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Backup Operator

Lets you manage backup services, except removal of backup, vault creation and giving access to others

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read | Gets result of Operation performed on Protection Container. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action | Performs Backup for Protected Item. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action | Provision Instant Item Recovery for Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action | Restore Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action | Revoke Instant Item Recovery for Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action | Refreshes the container list |
> | Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
> | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
> | Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
> | Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
> | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/* |  |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/write | The Register Service Container operation can be used to register a container with Recovery Service. |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/* |  |
> | Microsoft.RecoveryServices/Vaults/backupValidateOperation/action | Validate Operation on Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupOperations/read | Returns Backup Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read | Get Status of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/write | Creates a registered container |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/inquire/action | Do inquiry for workloads within a container |
> | Microsoft.RecoveryServices/Vaults/backupEngines/read | Returns all the backup management servers registered with vault. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read | Get a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read | Get all protectable containers |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read | Get all items in a container |
> | Microsoft.RecoveryServices/locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.RecoveryServices/locations/backupPreValidateProtection/action |  |
> | Microsoft.RecoveryServices/locations/backupValidateFeatures/action | Validate Features |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/write | Resolves the alert. |
> | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read | List all backup Protection Intents |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage backup services, except removal of backup, vault creation and giving access to others",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/00c29273-979b-4161-815c-10b084fb9324",
  "name": "00c29273-979b-4161-815c-10b084fb9324",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/provisionInstantItemRecovery/action",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/revokeInstantItemRecovery/action",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/refreshContainers/action",
        "Microsoft.RecoveryServices/Vaults/backupJobs/*",
        "Microsoft.RecoveryServices/Vaults/backupJobsExport/action",
        "Microsoft.RecoveryServices/Vaults/backupOperationResults/*",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectableItems/*",
        "Microsoft.RecoveryServices/Vaults/backupProtectedItems/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read",
        "Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read",
        "Microsoft.RecoveryServices/Vaults/certificates/write",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/read",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/write",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/read",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/*",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/write",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.RecoveryServices/Vaults/backupstorageconfig/*",
        "Microsoft.RecoveryServices/Vaults/backupValidateOperation/action",
        "Microsoft.RecoveryServices/Vaults/backupOperations/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/write",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/inquire/action",
        "Microsoft.RecoveryServices/Vaults/backupEngines/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectableContainers/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read",
        "Microsoft.RecoveryServices/locations/backupStatus/action",
        "Microsoft.RecoveryServices/locations/backupPreValidateProtection/action",
        "Microsoft.RecoveryServices/locations/backupValidateFeatures/action",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/write",
        "Microsoft.RecoveryServices/operations/read",
        "Microsoft.RecoveryServices/locations/operationStatus/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Backup Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Backup Reader

Can view backup services, but can't make changes

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read | Gets result of Operation performed on Protection Container. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Returns object details of the Protected Item |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
> | Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
> | Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
> | Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
> | Microsoft.RecoveryServices/Vaults/backupOperationResults/read | Returns Backup Operation Result for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
> | Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
> | Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
> | Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Microsoft.RecoveryServices/Vaults/backupstorageconfig/read | Returns Storage Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupconfig/read | Returns Configuration for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupOperations/read | Returns Backup Operation Status for Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read | Get Status of Policy Operation. |
> | Microsoft.RecoveryServices/Vaults/backupEngines/read | Returns all the backup management servers registered with vault. |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read | Get a backup Protection Intent |
> | Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read | Get all items in a container |
> | Microsoft.RecoveryServices/locations/backupStatus/action | Check Backup Status for Recovery Services Vaults |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/* |  |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/write | Resolves the alert. |
> | Microsoft.RecoveryServices/operations/read | Operation returns the list of Operations for a Resource Provider |
> | Microsoft.RecoveryServices/locations/operationStatus/read | Gets Operation Status for a given Operation |
> | Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read | List all backup Protection Intents |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/locations/backupValidateFeatures/action | Validate Features |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can view backup services, but can't make changes",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/a795c7a0-d4a2-40c1-ae25-d81f01202912",
  "name": "a795c7a0-d4a2-40c1-ae25-d81f01202912",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationsStatus/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read",
        "Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupJobs/read",
        "Microsoft.RecoveryServices/Vaults/backupJobsExport/action",
        "Microsoft.RecoveryServices/Vaults/backupOperationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectedItems/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read",
        "Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/read",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/read",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/read",
        "Microsoft.RecoveryServices/Vaults/backupstorageconfig/read",
        "Microsoft.RecoveryServices/Vaults/backupconfig/read",
        "Microsoft.RecoveryServices/Vaults/backupOperations/read",
        "Microsoft.RecoveryServices/Vaults/backupPolicies/operations/read",
        "Microsoft.RecoveryServices/Vaults/backupEngines/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/read",
        "Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/items/read",
        "Microsoft.RecoveryServices/locations/backupStatus/action",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/*",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/write",
        "Microsoft.RecoveryServices/operations/read",
        "Microsoft.RecoveryServices/locations/operationStatus/read",
        "Microsoft.RecoveryServices/Vaults/backupProtectionIntents/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/locations/backupValidateFeatures/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Backup Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Classic Storage Account Contributor

Lets you manage classic storage accounts, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ClassicStorage/storageAccounts/* | Create and manage storage accounts |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage classic storage accounts, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/86e8f5dc-a6e9-4c67-9d15-de283e8eac25",
  "name": "86e8f5dc-a6e9-4c67-9d15-de283e8eac25",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicStorage/storageAccounts/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Classic Storage Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Classic Storage Account Key Operator Service Role

Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ClassicStorage/storageAccounts/listkeys/action | Lists the access keys for the storage accounts. |
> | Microsoft.ClassicStorage/storageAccounts/regeneratekey/action | Regenerates the existing access keys for the storage account. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/985d6b00-f706-48f5-a6fe-d0ca12fb668d",
  "name": "985d6b00-f706-48f5-a6fe-d0ca12fb668d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ClassicStorage/storageAccounts/listkeys/action",
        "Microsoft.ClassicStorage/storageAccounts/regeneratekey/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Classic Storage Account Key Operator Service Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Data Box Contributor

Lets you manage everything under Data Box Service except giving access to others.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Databox/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage everything under Data Box Service except giving access to others.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/add466c9-e687-43fc-8d98-dfcf8d720be5",
  "name": "add466c9-e687-43fc-8d98-dfcf8d720be5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Databox/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Data Box Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Data Box Reader

Lets you manage Data Box Service except creating order or editing order details and giving access to others.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Databox/*/read |  |
> | Microsoft.Databox/jobs/listsecrets/action |  |
> | Microsoft.Databox/jobs/listcredentials/action | Lists the unencrypted credentials related to the order. |
> | Microsoft.Databox/locations/availableSkus/action | This method returns the list of available skus. |
> | Microsoft.Databox/locations/validateInputs/action | This method does all type of validations. |
> | Microsoft.Databox/locations/regionConfiguration/action | This method returns the configurations for the region. |
> | Microsoft.Databox/locations/validateAddress/action | Validates the shipping address and provides alternate addresses if any. |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Data Box Service except creating order or editing order details and giving access to others.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/028f4ed7-e2a9-465e-a8f4-9c0ffdfdc027",
  "name": "028f4ed7-e2a9-465e-a8f4-9c0ffdfdc027",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Databox/*/read",
        "Microsoft.Databox/jobs/listsecrets/action",
        "Microsoft.Databox/jobs/listcredentials/action",
        "Microsoft.Databox/locations/availableSkus/action",
        "Microsoft.Databox/locations/validateInputs/action",
        "Microsoft.Databox/locations/regionConfiguration/action",
        "Microsoft.Databox/locations/validateAddress/action",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Data Box Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Data Lake Analytics Developer

Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.BigAnalytics/accounts/* |  |
> | Microsoft.DataLakeAnalytics/accounts/* |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | Microsoft.BigAnalytics/accounts/Delete |  |
> | Microsoft.BigAnalytics/accounts/TakeOwnership/action |  |
> | Microsoft.BigAnalytics/accounts/Write |  |
> | Microsoft.DataLakeAnalytics/accounts/Delete | Delete a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/TakeOwnership/action | Grant permissions to cancel jobs submitted by other users. |
> | Microsoft.DataLakeAnalytics/accounts/Write | Create or update a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/Write | Create or update a linked DataLakeStore account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/Delete | Unlink a DataLakeStore account from a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/Write | Create or update a linked Storage account of a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/storageAccounts/Delete | Unlink a Storage account from a DataLakeAnalytics account. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/Write | Create or update a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/firewallRules/Delete | Delete a firewall rule. |
> | Microsoft.DataLakeAnalytics/accounts/computePolicies/Write | Create or update a compute policy. |
> | Microsoft.DataLakeAnalytics/accounts/computePolicies/Delete | Delete a compute policy. |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/47b7735b-770e-4598-a7da-8b91488b4c88",
  "name": "47b7735b-770e-4598-a7da-8b91488b4c88",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.BigAnalytics/accounts/*",
        "Microsoft.DataLakeAnalytics/accounts/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.BigAnalytics/accounts/Delete",
        "Microsoft.BigAnalytics/accounts/TakeOwnership/action",
        "Microsoft.BigAnalytics/accounts/Write",
        "Microsoft.DataLakeAnalytics/accounts/Delete",
        "Microsoft.DataLakeAnalytics/accounts/TakeOwnership/action",
        "Microsoft.DataLakeAnalytics/accounts/Write",
        "Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/Write",
        "Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/Delete",
        "Microsoft.DataLakeAnalytics/accounts/storageAccounts/Write",
        "Microsoft.DataLakeAnalytics/accounts/storageAccounts/Delete",
        "Microsoft.DataLakeAnalytics/accounts/firewallRules/Write",
        "Microsoft.DataLakeAnalytics/accounts/firewallRules/Delete",
        "Microsoft.DataLakeAnalytics/accounts/computePolicies/Write",
        "Microsoft.DataLakeAnalytics/accounts/computePolicies/Delete"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Data Lake Analytics Developer",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Reader and Data Access

Lets you view everything but will not let you delete or create a storage account or contained resource. It will also allow read/write access to all data contained in a storage account via access to storage account keys.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/ListAccountSas/action | Returns the Account SAS token for the specified storage account. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you view everything but will not let you delete or create a storage account or contained resource. It will also allow read/write access to all data contained in a storage account via access to storage account keys.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/c12c1c16-33a1-487b-954d-41c89c60f349",
  "name": "c12c1c16-33a1-487b-954d-41c89c60f349",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Storage/storageAccounts/ListAccountSas/action",
        "Microsoft.Storage/storageAccounts/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Reader and Data Access",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Account Contributor

Permits management of storage accounts. Provides access to the account key, which can be used to access data via Shared Key authorization.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/* | Create and manage storage accounts |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage storage accounts, including accessing storage account keys which provide full access to storage account data.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/17d1049b-9a84-46fb-8f53-869881c3d3ab",
  "name": "17d1049b-9a84-46fb-8f53-869881c3d3ab",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Account Key Operator Service Role

Permits listing and regenerating storage account access keys.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/regeneratekey/action | Regenerates the access keys for the specified storage account. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Storage Account Key Operators are allowed to list and regenerate keys on Storage Accounts",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/81a9662b-bebf-436f-a333-f67b29880f12",
  "name": "81a9662b-bebf-436f-a333-f67b29880f12",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/listkeys/action",
        "Microsoft.Storage/storageAccounts/regeneratekey/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Account Key Operator Service Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Blob Data Contributor

Read, write, and delete Azure Storage containers and blobs. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/delete | Delete a container. |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Return a container or a list of containers. |
> | Microsoft.Storage/storageAccounts/blobServices/containers/write | Modify a container's metadata or properties. |
> | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the Blob service. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete | Delete a blob. |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Return a blob or a list of blobs. |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write | Write to a blob. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read, write and delete access to Azure Storage blob containers and data",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe",
  "name": "ba92f5b4-2d11-453d-a403-e96b0029c9fe",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/write",
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Blob Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Blob Data Owner

Provides full access to Azure Storage blob containers and data, including assigning POSIX access control. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/* | Full permissions on containers. |
> | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the Blob service. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/* | Full permissions on blobs. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Azure Storage blob containers and data, including assigning POSIX access control.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b7e6dc6d-f1e8-4753-8033-0f276bb0955b",
  "name": "b7e6dc6d-f1e8-4753-8033-0f276bb0955b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/*",
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Blob Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Blob Data Reader

Read and list Azure Storage containers and blobs. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/read | Return a container or a list of containers. |
> | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the Blob service. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read | Return a blob or a list of blobs. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read access to Azure Storage blob containers and data",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
  "name": "2a2b9908-6ea1-4ae2-8e65-a410df84e7d1",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Blob Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Blob Delegator

Get a user delegation key, which can then be used to create a shared access signature for a container or blob that is signed with Azure AD credentials. For more information, see [Create a user delegation SAS](https://docs.microsoft.com/rest/api/storageservices/create-user-delegation-sas).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action | Returns a user delegation key for the Blob service. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for generation of a user delegation key which can be used to sign SAS tokens",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/db58b8e5-c6ad-4a2a-8342-4190687cbf4a",
  "name": "db58b8e5-c6ad-4a2a-8342-4190687cbf4a",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/blobServices/generateUserDelegationKey/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Blob Delegator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage File Data SMB Share Contributor

Allows for read, write, and delete access on files/directories in Azure file shares. This role has no built-in equivalent on Windows file servers.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read | Returns a file/folder or a list of files/folders. |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write | Returns the result of writing a file or creating a folder. |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete | Returns the result of deleting a file/folder. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read, write, and delete access in Azure Storage file shares over SMB",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/0c867c2a-1d8c-454a-a3db-ab2ea1bdc8bb",
  "name": "0c867c2a-1d8c-454a-a3db-ab2ea1bdc8bb",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read",
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write",
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage File Data SMB Share Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage File Data SMB Share Elevated Contributor

Allows for read, write, delete, and modify ACLs on files/directories in Azure file shares. This role is equivalent to a file share ACL of change on Windows file servers.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read | Returns a file/folder or a list of files/folders. |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write | Returns the result of writing a file or creating a folder. |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete | Returns the result of deleting a file/folder. |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action | Returns the result of modifying permission on a file/folder. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read, write, delete and modify NTFS permission access in Azure Storage file shares over SMB",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/a7264617-510b-434b-a828-9731dc254ea7",
  "name": "a7264617-510b-434b-a828-9731dc254ea7",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read",
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/write",
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/delete",
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/modifypermissions/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage File Data SMB Share Elevated Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage File Data SMB Share Reader

Allows for read access on files/directories in Azure file shares. This role is equivalent to a file share ACL of read on  Windows file servers.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read | Returns a file/folder or a list of files/folders. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read access to Azure File Share over SMB",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/aba4ae5f-2193-4029-9191-0cb91df5e314",
  "name": "aba4ae5f-2193-4029-9191-0cb91df5e314",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/fileServices/fileshares/files/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage File Data SMB Share Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Queue Data Contributor

Read, write, and delete Azure Storage queues and queue messages. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/delete | Delete a queue. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/read | Return a queue or a list of queues. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/write | Modify queue metadata or properties. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete | Delete one or more messages from a queue. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/read | Peek or retrieve one or more messages from a queue. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/write | Add a message to a queue. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read, write, and delete access to Azure Storage queues and queue messages",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/974c5e8b-45b9-4653-ba55-5f855dd0fb88",
  "name": "974c5e8b-45b9-4653-ba55-5f855dd0fb88",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/delete",
        "Microsoft.Storage/storageAccounts/queueServices/queues/read",
        "Microsoft.Storage/storageAccounts/queueServices/queues/write"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/delete",
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read",
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Queue Data Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Queue Data Message Processor

Peek, retrieve, and delete a message from an Azure Storage queue. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/read | Peek a message. |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action | Retrieve and delete a message. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for peek, receive, and delete access to Azure Storage queue messages",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8a0f0c08-91a1-4084-bc3d-661d67233fed",
  "name": "8a0f0c08-91a1-4084-bc3d-661d67233fed",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read",
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/process/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Queue Data Message Processor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Queue Data Message Sender

Add messages to an Azure Storage queue. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action | Add a message to a queue. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for sending of Azure Storage queue messages",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/c6a89b2d-59bc-44d0-9896-0f6e12d7b80a",
  "name": "c6a89b2d-59bc-44d0-9896-0f6e12d7b80a",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/add/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Queue Data Message Sender",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Storage Queue Data Reader

Read and list Azure Storage queues and queue messages. To learn which actions are required for a given data operation, see [Permissions for calling blob and queue data operations](https://docs.microsoft.com/rest/api/storageservices/authenticate-with-azure-active-directory#permissions-for-calling-blob-and-queue-data-operations).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/read | Returns a queue or a list of queues. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Storage/storageAccounts/queueServices/queues/messages/read | Peek or retrieve one or more messages from a queue. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for read access to Azure Storage queues and queue messages",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/19e7f393-937e-4f77-808e-94535e297925",
  "name": "19e7f393-937e-4f77-808e-94535e297925",
  "permissions": [
    {
      "actions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Storage/storageAccounts/queueServices/queues/messages/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Storage Queue Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Web


### Azure Maps Data Reader (Preview)

Grants access to read map related data from an Azure maps account.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Maps/accounts/data/read | Grants data read access to a maps account. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Grants access to read map related data from an Azure maps account.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/423170ca-a8f6-4b0f-8487-9e4eb8f49bfa",
  "name": "423170ca-a8f6-4b0f-8487-9e4eb8f49bfa",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.Maps/accounts/data/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Maps Data Reader (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Search Service Contributor

Lets you manage Search services, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Search/searchServices/* | Create and manage search services |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Search services, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/7ca78c08-252a-4471-8644-bb5ff32d4ba0",
  "name": "7ca78c08-252a-4471-8644-bb5ff32d4ba0",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Search/searchServices/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Search Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Web Plan Contributor

Lets you manage the web plans for websites, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Web/serverFarms/* | Create and manage server farms |
> | Microsoft.Web/hostingEnvironments/Join/Action | Joins an App Service Environment |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage the web plans for websites, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b",
  "name": "2cc479cb-7b4d-49a8-b449-8c00fd0f0a4b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/serverFarms/*",
        "Microsoft.Web/hostingEnvironments/Join/Action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Web Plan Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Website Contributor

Lets you manage websites (not web plans), but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/components/* | Create and manage Insights components |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Web/certificates/* | Create and manage website certificates |
> | Microsoft.Web/listSitesAssignedToHostName/read | Get names of sites assigned to hostname. |
> | Microsoft.Web/serverFarms/join/action |  |
> | Microsoft.Web/serverFarms/read | Get the properties on an App Service Plan |
> | Microsoft.Web/sites/* | Create and manage websites (site creation also requires write permissions to the associated App Service Plan) |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage websites (not web plans), but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/de139f84-1756-47ae-9be6-808fbbe84772",
  "name": "de139f84-1756-47ae-9be6-808fbbe84772",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/components/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/certificates/*",
        "Microsoft.Web/listSitesAssignedToHostName/read",
        "Microsoft.Web/serverFarms/join/action",
        "Microsoft.Web/serverFarms/read",
        "Microsoft.Web/sites/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Website Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Containers


### AcrDelete

acr delete

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerRegistry/registries/artifacts/delete | Delete artifact in a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr delete",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/c2f4ef07-c644-48eb-af81-4b1b4947fb11",
  "name": "c2f4ef07-c644-48eb-af81-4b1b4947fb11",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/artifacts/delete"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrDelete",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### AcrImageSigner

acr image signer

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerRegistry/registries/sign/write | Push/Pull content trust metadata for a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr image signer",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/6cef56e8-d556-48e5-a04f-b8e64114680f",
  "name": "6cef56e8-d556-48e5-a04f-b8e64114680f",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/sign/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrImageSigner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### AcrPull

acr pull

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerRegistry/registries/pull/read | Pull or Get images from a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr pull",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/7f951dda-4ed3-4680-a7ca-43fe172d538d",
  "name": "7f951dda-4ed3-4680-a7ca-43fe172d538d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/pull/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrPull",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### AcrPush

acr push

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerRegistry/registries/pull/read | Pull or Get images from a container registry. |
> | Microsoft.ContainerRegistry/registries/push/write | Push or Write images to a container registry. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr push",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8311e382-0749-4cb8-b61a-304f252e45ec",
  "name": "8311e382-0749-4cb8-b61a-304f252e45ec",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/pull/read",
        "Microsoft.ContainerRegistry/registries/push/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrPush",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### AcrQuarantineReader

acr quarantine data reader

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerRegistry/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr quarantine data reader",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/cdda3590-29a3-44f6-95f2-9f980659eb04",
  "name": "cdda3590-29a3-44f6-95f2-9f980659eb04",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/quarantine/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrQuarantineReader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### AcrQuarantineWriter

acr quarantine data writer

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerRegistry/registries/quarantine/read | Pull or Get quarantined images from container registry |
> | Microsoft.ContainerRegistry/registries/quarantine/write | Write/Modify quarantine state of quarantined images |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "acr quarantine data writer",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/c8d4ff99-41c3-41a8-9f60-21dfdad59608",
  "name": "c8d4ff99-41c3-41a8-9f60-21dfdad59608",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerRegistry/registries/quarantine/read",
        "Microsoft.ContainerRegistry/registries/quarantine/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "AcrQuarantineWriter",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Kubernetes Service Cluster Admin Role

List cluster admin credential action.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action | List the clusterAdmin credential of a managed cluster |
> | Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action | Get a managed cluster access profile by role name using list credential |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "List cluster admin credential action.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8",
  "name": "0ab0b1a8-8aac-4efd-b8c2-3ee1fb270be8",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/listClusterAdminCredential/action",
        "Microsoft.ContainerService/managedClusters/accessProfiles/listCredential/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service Cluster Admin Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Kubernetes Service Cluster User Role

List cluster user credential action.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ContainerService/managedClusters/listClusterUserCredential/action | List the clusterUser credential of a managed cluster |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "List cluster user credential action.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
  "name": "4abbcc35-e782-43d8-92c5-2d3f1bd2253f",
  "permissions": [
    {
      "actions": [
        "Microsoft.ContainerService/managedClusters/listClusterUserCredential/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Kubernetes Service Cluster User Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Databases


### Cosmos DB Account Reader Role

Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.DocumentDB/*/read | Read any collection |
> | Microsoft.DocumentDB/databaseAccounts/readonlykeys/action | Reads the database account readonly keys. |
> | Microsoft.Insights/MetricDefinitions/read | Read metric definitions |
> | Microsoft.Insights/Metrics/read | Read metrics |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read Azure Cosmos DB Accounts data",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/fbdf93bf-df7d-467e-a4d2-9458aa1360c8",
  "name": "fbdf93bf-df7d-467e-a4d2-9458aa1360c8",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.DocumentDB/*/read",
        "Microsoft.DocumentDB/databaseAccounts/readonlykeys/action",
        "Microsoft.Insights/MetricDefinitions/read",
        "Microsoft.Insights/Metrics/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cosmos DB Account Reader Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Cosmos DB Operator

Lets you manage Azure Cosmos DB accounts, but not access data in them. Prevents access to account keys and connection strings.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.DocumentDb/databaseAccounts/* |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | **NotActions** |  |
> | Microsoft.DocumentDB/databaseAccounts/readonlyKeys/* |  |
> | Microsoft.DocumentDB/databaseAccounts/regenerateKey/* |  |
> | Microsoft.DocumentDB/databaseAccounts/listKeys/* |  |
> | Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Azure Cosmos DB accounts, but not access data in them. Prevents access to account keys and connection strings.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/230815da-be43-4aae-9cb4-875f7bd000aa",
  "name": "230815da-be43-4aae-9cb4-875f7bd000aa",
  "permissions": [
    {
      "actions": [
        "Microsoft.DocumentDb/databaseAccounts/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action"
      ],
      "notActions": [
        "Microsoft.DocumentDB/databaseAccounts/readonlyKeys/*",
        "Microsoft.DocumentDB/databaseAccounts/regenerateKey/*",
        "Microsoft.DocumentDB/databaseAccounts/listKeys/*",
        "Microsoft.DocumentDB/databaseAccounts/listConnectionStrings/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cosmos DB Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### CosmosBackupOperator

Can submit restore request for a Cosmos DB database or a container for an account

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.DocumentDB/databaseAccounts/backup/action | Submit a request to configure backup |
> | Microsoft.DocumentDB/databaseAccounts/restore/action | Submit a restore request |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can submit restore request for a Cosmos DB database or a container for an account",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/db7b14f2-5adf-42da-9f96-f2ee17bab5cb",
  "name": "db7b14f2-5adf-42da-9f96-f2ee17bab5cb",
  "permissions": [
    {
      "actions": [
        "Microsoft.DocumentDB/databaseAccounts/backup/action",
        "Microsoft.DocumentDB/databaseAccounts/restore/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "CosmosBackupOperator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### DocumentDB Account Contributor

Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.DocumentDb/databaseAccounts/* | Create and manage Azure Cosmos DB accounts |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage DocumentDB accounts, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5bd9cd88-fe45-4216-938b-f97437e15450",
  "name": "5bd9cd88-fe45-4216-938b-f97437e15450",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.DocumentDb/databaseAccounts/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "DocumentDB Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Redis Cache Contributor

Lets you manage Redis caches, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Cache/redis/* | Create and manage Redis caches |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Redis caches, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/e0f68234-74aa-48ed-b826-c38b57376e17",
  "name": "e0f68234-74aa-48ed-b826-c38b57376e17",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Cache/redis/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Redis Cache Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### SQL DB Contributor

Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Sql/locations/*/read |  |
> | Microsoft.Sql/servers/databases/* | Create and manage SQL databases |
> | Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Insights/metrics/read | Read metrics |
> | Microsoft.Insights/metricDefinitions/read | Read metric definitions |
> | **NotActions** |  |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/* |  |
> | Microsoft.Sql/managedInstances/databases/sensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/* |  |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/servers/databases/auditingPolicies/* | Edit audit policies |
> | Microsoft.Sql/servers/databases/auditingSettings/* | Edit audit settings |
> | Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | Microsoft.Sql/servers/databases/connectionPolicies/* | Edit connection policies |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Edit data masking policies |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/* |  |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/* | Edit security alert policies |
> | Microsoft.Sql/servers/databases/securityMetrics/* | Edit security metrics |
> | Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |
> | Microsoft.Sql/servers/vulnerabilityAssessments/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/9b7fa17d-e63e-47b0-bb0a-15c516ac86ec",
  "name": "9b7fa17d-e63e-47b0-bb0a-15c516ac86ec",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Sql/locations/*/read",
        "Microsoft.Sql/servers/databases/*",
        "Microsoft.Sql/servers/read",
        "Microsoft.Support/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read"
      ],
      "notActions": [
        "Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/auditingPolicies/*",
        "Microsoft.Sql/servers/databases/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditRecords/read",
        "Microsoft.Sql/servers/databases/connectionPolicies/*",
        "Microsoft.Sql/servers/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/dataMaskingPolicies/*",
        "Microsoft.Sql/servers/databases/extendedAuditingSettings/*",
        "Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/securityAlertPolicies/*",
        "Microsoft.Sql/servers/databases/securityMetrics/*",
        "Microsoft.Sql/servers/databases/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/*",
        "Microsoft.Sql/servers/vulnerabilityAssessments/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL DB Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### SQL Managed Instance Contributor

Lets you manage SQL Managed Instances and required network configuration, but can't give access to others.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Network/networkSecurityGroups/* |  |
> | Microsoft.Network/routeTables/* |  |
> | Microsoft.Sql/locations/*/read |  |
> | Microsoft.Sql/managedInstances/* |  |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Network/virtualNetworks/subnets/* |  |
> | Microsoft.Network/virtualNetworks/* |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/metrics/read | Read metrics |
> | Microsoft.Insights/metricDefinitions/read | Read metric definitions |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage SQL Managed Instances and required network configuration, but can't give access to others.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4939a1f6-9ae0-4e48-a1e0-f2cbe897382d",
  "name": "4939a1f6-9ae0-4e48-a1e0-f2cbe897382d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Network/networkSecurityGroups/*",
        "Microsoft.Network/routeTables/*",
        "Microsoft.Sql/locations/*/read",
        "Microsoft.Sql/managedInstances/*",
        "Microsoft.Support/*",
        "Microsoft.Network/virtualNetworks/subnets/*",
        "Microsoft.Network/virtualNetworks/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL Managed Instance Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### SQL Security Manager

Lets you manage the security-related policies of SQL servers and databases, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. Not alertable. |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/* |  |
> | Microsoft.Sql/managedInstances/databases/sensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/* |  |
> | Microsoft.Sql/managedInstances/databases/transparentDataEncryption/* |  |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/servers/auditingPolicies/* | Create and manage SQL server auditing policies |
> | Microsoft.Sql/servers/auditingSettings/* | Create and manage SQL server auditing setting |
> | Microsoft.Sql/servers/extendedAuditingSettings/read | Retrieve details of the extended server blob auditing policy configured on a given server |
> | Microsoft.Sql/servers/databases/auditingPolicies/* | Create and manage SQL server database auditing policies |
> | Microsoft.Sql/servers/databases/auditingSettings/* | Create and manage SQL server database auditing settings |
> | Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | Microsoft.Sql/servers/databases/connectionPolicies/* | Create and manage SQL server database connection policies |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Create and manage SQL server database data masking policies |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/read | Retrieve details of the extended blob auditing policy configured on a given database |
> | Microsoft.Sql/servers/databases/read | Return the list of databases or gets the properties for the specified database. |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/schemas/read | Get a database schema. |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/read | Get a database column. |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/schemas/tables/read | Get a database table. |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/* | Create and manage SQL server database security alert policies |
> | Microsoft.Sql/servers/databases/securityMetrics/* | Create and manage SQL server database security metrics |
> | Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/transparentDataEncryption/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |
> | Microsoft.Sql/servers/firewallRules/* |  |
> | Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
> | Microsoft.Sql/servers/securityAlertPolicies/* | Create and manage SQL server security alert policies |
> | Microsoft.Sql/servers/vulnerabilityAssessments/* |  |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage the security-related policies of SQL servers and databases, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/056cd41c-7e88-42e1-933e-88ba6a50c9c3",
  "name": "056cd41c-7e88-42e1-933e-88ba6a50c9c3",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/transparentDataEncryption/*",
        "Microsoft.Sql/managedInstances/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/auditingPolicies/*",
        "Microsoft.Sql/servers/auditingSettings/*",
        "Microsoft.Sql/servers/extendedAuditingSettings/read",
        "Microsoft.Sql/servers/databases/auditingPolicies/*",
        "Microsoft.Sql/servers/databases/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditRecords/read",
        "Microsoft.Sql/servers/databases/connectionPolicies/*",
        "Microsoft.Sql/servers/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/dataMaskingPolicies/*",
        "Microsoft.Sql/servers/databases/extendedAuditingSettings/read",
        "Microsoft.Sql/servers/databases/read",
        "Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/read",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/read",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/tables/read",
        "Microsoft.Sql/servers/databases/securityAlertPolicies/*",
        "Microsoft.Sql/servers/databases/securityMetrics/*",
        "Microsoft.Sql/servers/databases/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/transparentDataEncryption/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/*",
        "Microsoft.Sql/servers/firewallRules/*",
        "Microsoft.Sql/servers/read",
        "Microsoft.Sql/servers/securityAlertPolicies/*",
        "Microsoft.Sql/servers/vulnerabilityAssessments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL Security Manager",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### SQL Server Contributor

Lets you manage SQL servers and databases, but not access to them, and not their security-related policies.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Sql/locations/*/read |  |
> | Microsoft.Sql/servers/* | Create and manage SQL servers |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Insights/metrics/read | Read metrics |
> | Microsoft.Insights/metricDefinitions/read | Read metric definitions |
> | **NotActions** |  |
> | Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/securityAlertPolicies/* |  |
> | Microsoft.Sql/managedInstances/databases/sensitivityLabels/* |  |
> | Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/managedInstances/securityAlertPolicies/* |  |
> | Microsoft.Sql/managedInstances/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/servers/auditingPolicies/* | Edit SQL server auditing policies |
> | Microsoft.Sql/servers/auditingSettings/* | Edit SQL server auditing settings |
> | Microsoft.Sql/servers/databases/auditingPolicies/* | Edit SQL server database auditing policies |
> | Microsoft.Sql/servers/databases/auditingSettings/* | Edit SQL server database auditing settings |
> | Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
> | Microsoft.Sql/servers/databases/connectionPolicies/* | Edit SQL server database connection policies |
> | Microsoft.Sql/servers/databases/currentSensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Edit SQL server database data masking policies |
> | Microsoft.Sql/servers/databases/extendedAuditingSettings/* |  |
> | Microsoft.Sql/servers/databases/recommendedSensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/securityAlertPolicies/* | Edit SQL server database security alert policies |
> | Microsoft.Sql/servers/databases/securityMetrics/* | Edit SQL server database security metrics |
> | Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
> | Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |
> | Microsoft.Sql/servers/extendedAuditingSettings/* |  |
> | Microsoft.Sql/servers/securityAlertPolicies/* | Edit SQL server security alert policies |
> | Microsoft.Sql/servers/vulnerabilityAssessments/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage SQL servers and databases, but not access to them, and not their security -related policies.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437",
  "name": "6d8ee4ec-f05a-4a1d-8b00-a9b17e38b437",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Sql/locations/*/read",
        "Microsoft.Sql/servers/*",
        "Microsoft.Support/*",
        "Microsoft.Insights/metrics/read",
        "Microsoft.Insights/metricDefinitions/read"
      ],
      "notActions": [
        "Microsoft.Sql/managedInstances/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/databases/sensitivityLabels/*",
        "Microsoft.Sql/managedInstances/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/managedInstances/securityAlertPolicies/*",
        "Microsoft.Sql/managedInstances/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/auditingPolicies/*",
        "Microsoft.Sql/servers/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditingPolicies/*",
        "Microsoft.Sql/servers/databases/auditingSettings/*",
        "Microsoft.Sql/servers/databases/auditRecords/read",
        "Microsoft.Sql/servers/databases/connectionPolicies/*",
        "Microsoft.Sql/servers/databases/currentSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/dataMaskingPolicies/*",
        "Microsoft.Sql/servers/databases/extendedAuditingSettings/*",
        "Microsoft.Sql/servers/databases/recommendedSensitivityLabels/*",
        "Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/securityAlertPolicies/*",
        "Microsoft.Sql/servers/databases/securityMetrics/*",
        "Microsoft.Sql/servers/databases/sensitivityLabels/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessments/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/*",
        "Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/*",
        "Microsoft.Sql/servers/extendedAuditingSettings/*",
        "Microsoft.Sql/servers/securityAlertPolicies/*",
        "Microsoft.Sql/servers/vulnerabilityAssessments/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "SQL Server Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Analytics


### Azure Event Hubs Data Owner

Allows for full access to Azure Event Hubs resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.EventHub/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.EventHub/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Azure Event Hubs resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/f526a384-b230-433a-b45c-95f59c4a2dec",
  "name": "f526a384-b230-433a-b45c-95f59c4a2dec",
  "permissions": [
    {
      "actions": [
        "Microsoft.EventHub/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.EventHub/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Event Hubs Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Event Hubs Data Receiver

Allows receive access to Azure Event Hubs resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.EventHub/*/eventhubs/consumergroups/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.EventHub/*/receive/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows receive access to Azure Event Hubs resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/a638d3c7-ab3a-418d-83e6-5f17a39d4fde",
  "name": "a638d3c7-ab3a-418d-83e6-5f17a39d4fde",
  "permissions": [
    {
      "actions": [
        "Microsoft.EventHub/*/eventhubs/consumergroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.EventHub/*/receive/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Event Hubs Data Receiver",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Event Hubs Data Sender

Allows send access to Azure Event Hubs resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.EventHub/*/eventhubs/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.EventHub/*/send/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows send access to Azure Event Hubs resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2b629674-e913-4c01-ae53-ef4638d8f975",
  "name": "2b629674-e913-4c01-ae53-ef4638d8f975",
  "permissions": [
    {
      "actions": [
        "Microsoft.EventHub/*/eventhubs/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.EventHub/*/send/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Event Hubs Data Sender",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Data Factory Contributor

Create and manage data factories, as well as child resources within them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.DataFactory/dataFactories/* | Create and manage data factories, and child resources within them. |
> | Microsoft.DataFactory/factories/* | Create and manage data factories, and child resources within them. |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.EventGrid/eventSubscriptions/write | Create or update an eventSubscription |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create and manage data factories, as well as child resources within them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/673868aa-7521-48a0-acc6-0f60742d39f5",
  "name": "673868aa-7521-48a0-acc6-0f60742d39f5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.DataFactory/dataFactories/*",
        "Microsoft.DataFactory/factories/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.EventGrid/eventSubscriptions/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Data Factory Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Data Purger

Can purge analytics data

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Insights/components/*/read |  |
> | Microsoft.Insights/components/purge/action | Purging data from Application Insights |
> | Microsoft.OperationalInsights/workspaces/*/read | View log analytics data |
> | Microsoft.OperationalInsights/workspaces/purge/action | Delete specified data from workspace |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can purge analytics data",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/150f5e0c-0603-4f03-8c7f-cf70034c4e90",
  "name": "150f5e0c-0603-4f03-8c7f-cf70034c4e90",
  "permissions": [
    {
      "actions": [
        "Microsoft.Insights/components/*/read",
        "Microsoft.Insights/components/purge/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/purge/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Data Purger",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### HDInsight Cluster Operator

Lets you read and modify HDInsight cluster configurations.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.HDInsight/*/read |  |
> | Microsoft.HDInsight/clusters/getGatewaySettings/action | Get gateway settings for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/updateGatewaySettings/action | Update gateway settings for HDInsight Cluster |
> | Microsoft.HDInsight/clusters/configurations/* |  |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read and modify HDInsight cluster configurations.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/61ed4efc-fab3-44fd-b111-e24485cc132a",
  "name": "61ed4efc-fab3-44fd-b111-e24485cc132a",
  "permissions": [
    {
      "actions": [
        "Microsoft.HDInsight/*/read",
        "Microsoft.HDInsight/clusters/getGatewaySettings/action",
        "Microsoft.HDInsight/clusters/updateGatewaySettings/action",
        "Microsoft.HDInsight/clusters/configurations/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "HDInsight Cluster Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### HDInsight Domain Services Contributor

Can Read, Create, Modify and Delete Domain Services related operations needed for HDInsight Enterprise Security Package

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.AAD/*/read |  |
> | Microsoft.AAD/domainServices/*/read |  |
> | Microsoft.AAD/domainServices/oucontainer/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can Read, Create, Modify and Delete Domain Services related operations needed for HDInsight Enterprise Security Package",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8d8d5a11-05d3-4bda-a417-a08778121c7c",
  "name": "8d8d5a11-05d3-4bda-a417-a08778121c7c",
  "permissions": [
    {
      "actions": [
        "Microsoft.AAD/*/read",
        "Microsoft.AAD/domainServices/*/read",
        "Microsoft.AAD/domainServices/oucontainer/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "HDInsight Domain Services Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Log Analytics Contributor

Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; creating and configuring Automation accounts; adding solutions; and configuring Azure diagnostics on all Azure resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.Automation/automationAccounts/* |  |
> | Microsoft.ClassicCompute/virtualMachines/extensions/* |  |
> | Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | Microsoft.Compute/virtualMachines/extensions/* |  |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | Microsoft.OperationalInsights/* |  |
> | Microsoft.OperationsManagement/* |  |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/* |  |
> | Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; creating and configuring Automation accounts; adding solutions; and configuring Azure diagnostics on all Azure resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/92aaf0da-9dab-42b6-94a3-d43ce8d16293",
  "name": "92aaf0da-9dab-42b6-94a3-d43ce8d16293",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Automation/automationAccounts/*",
        "Microsoft.ClassicCompute/virtualMachines/extensions/*",
        "Microsoft.ClassicStorage/storageAccounts/listKeys/action",
        "Microsoft.Compute/virtualMachines/extensions/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.OperationalInsights/*",
        "Microsoft.OperationsManagement/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.Storage/storageAccounts/listKeys/action",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Log Analytics Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Log Analytics Reader

Log Analytics Reader can view and search all monitoring data as well as and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | Microsoft.OperationalInsights/workspaces/sharedKeys/read | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Log Analytics Reader can view and search all monitoring data as well as and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/73c42c96-874c-492b-b04d-ab87d138a893",
  "name": "73c42c96-874c-492b-b04d-ab87d138a893",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/search/action",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.OperationalInsights/workspaces/sharedKeys/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Log Analytics Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Blockchain


### Blockchain Member Node Access (Preview)

Allows for access to Blockchain Member nodes

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/read | Gets or Lists existing Blockchain Member Transaction Node(s). |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Blockchain/blockchainMembers/transactionNodes/connect/action | Connects to a Blockchain Member Transaction Node. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for access to Blockchain Member nodes",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/31a002a1-acaf-453e-8a5b-297c9ca1ea24",
  "name": "31a002a1-acaf-453e-8a5b-297c9ca1ea24",
  "permissions": [
    {
      "actions": [
        "Microsoft.Blockchain/blockchainMembers/transactionNodes/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Blockchain/blockchainMembers/transactionNodes/connect/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Blockchain Member Node Access (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## AI + machine learning


### Cognitive Services Contributor

Lets you create, read, update, delete and manage keys of Cognitive Services.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.CognitiveServices/* |  |
> | Microsoft.Features/features/read | Gets the features of a subscription. |
> | Microsoft.Features/providers/features/read | Gets the feature of a subscription in a given resource provider. |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | Microsoft.Insights/logDefinitions/read | Read log definitions |
> | Microsoft.Insights/metricdefinitions/read | Read metric definitions |
> | Microsoft.Insights/metrics/read | Read metrics |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Microsoft.Resources/subscriptions/resourcegroups/deployments/* |  |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create, read, update, delete and manage keys of Cognitive Services.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
  "name": "25fbc0a9-bd7c-42a3-aa1a-3b75d497ee68",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.CognitiveServices/*",
        "Microsoft.Features/features/read",
        "Microsoft.Features/providers/features/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.Insights/logDefinitions/read",
        "Microsoft.Insights/metricdefinitions/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourcegroups/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Cognitive Services Data Reader (Preview)

Lets you read Cognitive Services data.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.CognitiveServices/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read Cognitive Services data.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b59867f0-fa02-499b-be73-45a86b5b3e1c",
  "name": "b59867f0-fa02-499b-be73-45a86b5b3e1c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services Data Reader (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Cognitive Services User

Lets you read and list keys of Cognitive Services.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.CognitiveServices/*/read |  |
> | Microsoft.CognitiveServices/accounts/listkeys/action | List Keys |
> | Microsoft.Insights/alertRules/read | Read a classic metric alert |
> | Microsoft.Insights/diagnosticSettings/read | Read a resource diagnostic setting |
> | Microsoft.Insights/logDefinitions/read | Read log definitions |
> | Microsoft.Insights/metricdefinitions/read | Read metric definitions |
> | Microsoft.Insights/metrics/read | Read metrics |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.CognitiveServices/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read and list keys of Cognitive Services.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/a97b65f3-24c7-4388-baec-2e87135dc908",
  "name": "a97b65f3-24c7-4388-baec-2e87135dc908",
  "permissions": [
    {
      "actions": [
        "Microsoft.CognitiveServices/*/read",
        "Microsoft.CognitiveServices/accounts/listkeys/action",
        "Microsoft.Insights/alertRules/read",
        "Microsoft.Insights/diagnosticSettings/read",
        "Microsoft.Insights/logDefinitions/read",
        "Microsoft.Insights/metricdefinitions/read",
        "Microsoft.Insights/metrics/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.CognitiveServices/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Cognitive Services User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Mixed reality


### Spatial Anchors Account Contributor

Lets you manage spatial anchors in your account, but not delete them

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/write | Update spatial anchors properties |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage spatial anchors in your account, but not delete them",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8bbe83f1-e2a6-4df7-8cb4-4e04d4e5c827",
  "name": "8bbe83f1-e2a6-4df7-8cb4-4e04d4e5c827",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/SpatialAnchorsAccounts/create/action",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/query/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Spatial Anchors Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Spatial Anchors Account Owner

Lets you manage spatial anchors in your account, including deleting them

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/create/action | Create spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/delete | Delete spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/write | Update spatial anchors properties |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage spatial anchors in your account, including deleting them",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/70bbe301-9835-447d-afdd-19eb3167307c",
  "name": "70bbe301-9835-447d-afdd-19eb3167307c",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/SpatialAnchorsAccounts/create/action",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/delete",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/query/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Spatial Anchors Account Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Spatial Anchors Account Reader

Lets you locate and read properties of spatial anchors in your account

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read | Discover nearby spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read | Get properties of spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/query/read | Locate spatial anchors |
> | Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read | Submit diagnostics data to help improve the quality of the Azure Spatial Anchors service |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you locate and read properties of spatial anchors in your account",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5d51204f-eb77-4b1c-b86a-2ec626c49413",
  "name": "5d51204f-eb77-4b1c-b86a-2ec626c49413",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.MixedReality/SpatialAnchorsAccounts/discovery/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/properties/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/query/read",
        "Microsoft.MixedReality/SpatialAnchorsAccounts/submitdiag/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Spatial Anchors Account Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Integration


### API Management Service Contributor

Can manage service and the APIs

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ApiManagement/service/* | Create and manage API Management service |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage service and the APIs",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/312a565d-c81f-4fd8-895a-4e21e48d571c",
  "name": "312a565d-c81f-4fd8-895a-4e21e48d571c",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### API Management Service Operator Role

Can manage service but not the APIs

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ApiManagement/service/*/read | Read API Management Service instances |
> | Microsoft.ApiManagement/service/backup/action | Backup API Management Service to the specified container in a user provided storage account |
> | Microsoft.ApiManagement/service/delete | Delete API Management Service instance |
> | Microsoft.ApiManagement/service/managedeployments/action | Change SKU/units, add/remove regional deployments of API Management Service |
> | Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
> | Microsoft.ApiManagement/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
> | Microsoft.ApiManagement/service/updatecertificate/action | Upload TLS/SSL certificate for an API Management Service |
> | Microsoft.ApiManagement/service/updatehostname/action | Setup, update or remove custom domain names for an API Management Service |
> | Microsoft.ApiManagement/service/write | Create or Update API Management Service instance |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | Microsoft.ApiManagement/service/users/keys/read | Get keys associated with user |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage service but not the APIs",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/e022efe7-f5ba-4159-bbe4-b44f577e9b61",
  "name": "e022efe7-f5ba-4159-bbe4-b44f577e9b61",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/*/read",
        "Microsoft.ApiManagement/service/backup/action",
        "Microsoft.ApiManagement/service/delete",
        "Microsoft.ApiManagement/service/managedeployments/action",
        "Microsoft.ApiManagement/service/read",
        "Microsoft.ApiManagement/service/restore/action",
        "Microsoft.ApiManagement/service/updatecertificate/action",
        "Microsoft.ApiManagement/service/updatehostname/action",
        "Microsoft.ApiManagement/service/write",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.ApiManagement/service/users/keys/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Operator Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### API Management Service Reader Role

Read-only access to service and APIs

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ApiManagement/service/*/read | Read API Management Service instances |
> | Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | Microsoft.ApiManagement/service/users/keys/read | Get keys associated with user |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read-only access to service and APIs",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/71522526-b88f-4d52-b57f-d31fc3546d0d",
  "name": "71522526-b88f-4d52-b57f-d31fc3546d0d",
  "permissions": [
    {
      "actions": [
        "Microsoft.ApiManagement/service/*/read",
        "Microsoft.ApiManagement/service/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.ApiManagement/service/users/keys/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "API Management Service Reader Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### App Configuration Data Owner

Allows full access to App Configuration data.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.AppConfiguration/configurationStores/*/read |  |
> | Microsoft.AppConfiguration/configurationStores/*/write |  |
> | Microsoft.AppConfiguration/configurationStores/*/delete |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows full access to App Configuration data.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b",
  "name": "5ae67dd6-50cb-40e7-96ff-dc2bfa4b606b",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppConfiguration/configurationStores/*/read",
        "Microsoft.AppConfiguration/configurationStores/*/write",
        "Microsoft.AppConfiguration/configurationStores/*/delete"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "App Configuration Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### App Configuration Data Reader

Allows read access to App Configuration data.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | *none* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.AppConfiguration/configurationStores/*/read |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read access to App Configuration data.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/516239f1-63e1-4d78-a4de-a74fb236a071",
  "name": "516239f1-63e1-4d78-a4de-a74fb236a071",
  "permissions": [
    {
      "actions": [],
      "notActions": [],
      "dataActions": [
        "Microsoft.AppConfiguration/configurationStores/*/read"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "App Configuration Data Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Service Bus Data Owner

Allows for full access to Azure Service Bus resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ServiceBus/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.ServiceBus/* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for full access to Azure Service Bus resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/090c5cfd-751d-490a-894a-3ce6f1109419",
  "name": "090c5cfd-751d-490a-894a-3ce6f1109419",
  "permissions": [
    {
      "actions": [
        "Microsoft.ServiceBus/*"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ServiceBus/*"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Service Bus Data Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Service Bus Data Receiver

Allows for receive access to Azure Service Bus resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ServiceBus/*/queues/read |  |
> | Microsoft.ServiceBus/*/topics/read |  |
> | Microsoft.ServiceBus/*/topics/subscriptions/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.ServiceBus/*/receive/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for receive access to Azure Service Bus resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0",
  "name": "4f6d3b9b-027b-4f4c-9142-0e5a2a2247e0",
  "permissions": [
    {
      "actions": [
        "Microsoft.ServiceBus/*/queues/read",
        "Microsoft.ServiceBus/*/topics/read",
        "Microsoft.ServiceBus/*/topics/subscriptions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ServiceBus/*/receive/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Service Bus Data Receiver",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Service Bus Data Sender

Allows for send access to Azure Service Bus resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ServiceBus/*/queues/read |  |
> | Microsoft.ServiceBus/*/topics/read |  |
> | Microsoft.ServiceBus/*/topics/subscriptions/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.ServiceBus/*/send/action |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for send access to Azure Service Bus resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/69a216fc-b8fb-44d8-bc22-1f3c2cd27a39",
  "name": "69a216fc-b8fb-44d8-bc22-1f3c2cd27a39",
  "permissions": [
    {
      "actions": [
        "Microsoft.ServiceBus/*/queues/read",
        "Microsoft.ServiceBus/*/topics/read",
        "Microsoft.ServiceBus/*/topics/subscriptions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.ServiceBus/*/send/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Service Bus Data Sender",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Stack Registration Owner

Lets you manage Azure Stack registrations.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.AzureStack/registrations/products/*/action |  |
> | Microsoft.AzureStack/registrations/products/read | Gets the properties of an Azure Stack Marketplace product |
> | Microsoft.AzureStack/registrations/read | Gets the properties of an Azure Stack registration |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Azure Stack registrations.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/6f12a6df-dd06-4f3e-bcb1-ce8be600526a",
  "name": "6f12a6df-dd06-4f3e-bcb1-ce8be600526a",
  "permissions": [
    {
      "actions": [
        "Microsoft.AzureStack/registrations/products/*/action",
        "Microsoft.AzureStack/registrations/products/read",
        "Microsoft.AzureStack/registrations/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Stack Registration Owner",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### EventGrid EventSubscription Contributor

Lets you manage EventGrid event subscription operations.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.EventGrid/eventSubscriptions/* |  |
> | Microsoft.EventGrid/topicTypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | Microsoft.EventGrid/locations/eventSubscriptions/read | List regional event subscriptions |
> | Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage EventGrid event subscription operations.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/428e0ff0-5e57-4d9c-a221-2c70d0e0a443",
  "name": "428e0ff0-5e57-4d9c-a221-2c70d0e0a443",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/eventSubscriptions/*",
        "Microsoft.EventGrid/topicTypes/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid EventSubscription Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### EventGrid EventSubscription Reader

Lets you read EventGrid event subscriptions.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.EventGrid/eventSubscriptions/read | Read an eventSubscription |
> | Microsoft.EventGrid/topicTypes/eventSubscriptions/read | List global event subscriptions by topic type |
> | Microsoft.EventGrid/locations/eventSubscriptions/read | List regional event subscriptions |
> | Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read | List regional event subscriptions by topictype |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read EventGrid event subscriptions.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/2414bbcf-6497-4faf-8c65-045460748405",
  "name": "2414bbcf-6497-4faf-8c65-045460748405",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.EventGrid/eventSubscriptions/read",
        "Microsoft.EventGrid/topicTypes/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/eventSubscriptions/read",
        "Microsoft.EventGrid/locations/topicTypes/eventSubscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "EventGrid EventSubscription Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Intelligent Systems Account Contributor

Lets you manage Intelligent Systems accounts, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.IntelligentSystems/accounts/* | Create and manage intelligent systems accounts |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Intelligent Systems accounts, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/03a6d094-3444-4b3d-88af-7477090a9e5e",
  "name": "03a6d094-3444-4b3d-88af-7477090a9e5e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.IntelligentSystems/accounts/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Intelligent Systems Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Logic App Contributor

Lets you manage logic apps, but not change access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
> | Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/metricAlerts/* |  |
> | Microsoft.Insights/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | Microsoft.Insights/logdefinitions/* | This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
> | Microsoft.Insights/metricDefinitions/* | Read metric definitions (list of available metric types for a resource). |
> | Microsoft.Logic/* | Manages Logic Apps resources. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Web/connectionGateways/* | Create and manages a Connection Gateway. |
> | Microsoft.Web/connections/* | Create and manages a Connection. |
> | Microsoft.Web/customApis/* | Creates and manages a Custom API. |
> | Microsoft.Web/serverFarms/join/action |  |
> | Microsoft.Web/serverFarms/read | Get the properties on an App Service Plan |
> | Microsoft.Web/sites/functions/listSecrets/action | List Function secrets. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage logic app, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/87a39d53-fc1b-424a-814c-f7e04687dc9e",
  "name": "87a39d53-fc1b-424a-814c-f7e04687dc9e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicStorage/storageAccounts/listKeys/action",
        "Microsoft.ClassicStorage/storageAccounts/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metricAlerts/*",
        "Microsoft.Insights/diagnosticSettings/*",
        "Microsoft.Insights/logdefinitions/*",
        "Microsoft.Insights/metricDefinitions/*",
        "Microsoft.Logic/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/listkeys/action",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Support/*",
        "Microsoft.Web/connectionGateways/*",
        "Microsoft.Web/connections/*",
        "Microsoft.Web/customApis/*",
        "Microsoft.Web/serverFarms/join/action",
        "Microsoft.Web/serverFarms/read",
        "Microsoft.Web/sites/functions/listSecrets/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic App Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Logic App Operator

Lets you read, enable, and disable logic apps, but not edit or update them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/*/read | Read Insights alert rules |
> | Microsoft.Insights/metricAlerts/*/read |  |
> | Microsoft.Insights/diagnosticSettings/*/read | Gets diagnostic settings for Logic Apps |
> | Microsoft.Insights/metricDefinitions/*/read | Gets the available metrics for Logic Apps. |
> | Microsoft.Logic/*/read | Reads Logic Apps resources. |
> | Microsoft.Logic/workflows/disable/action | Disables the workflow. |
> | Microsoft.Logic/workflows/enable/action | Enables the workflow. |
> | Microsoft.Logic/workflows/validate/action | Validates the workflow. |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Web/connectionGateways/*/read | Read Connection Gateways. |
> | Microsoft.Web/connections/*/read | Read Connections. |
> | Microsoft.Web/customApis/*/read | Read Custom API. |
> | Microsoft.Web/serverFarms/read | Get the properties on an App Service Plan |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read, enable and disable logic app.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/515c2055-d9d4-4321-b1b9-bd0c9a0f79fe",
  "name": "515c2055-d9d4-4321-b1b9-bd0c9a0f79fe",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*/read",
        "Microsoft.Insights/metricAlerts/*/read",
        "Microsoft.Insights/diagnosticSettings/*/read",
        "Microsoft.Insights/metricDefinitions/*/read",
        "Microsoft.Logic/*/read",
        "Microsoft.Logic/workflows/disable/action",
        "Microsoft.Logic/workflows/enable/action",
        "Microsoft.Logic/workflows/validate/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/subscriptions/operationresults/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Web/connectionGateways/*/read",
        "Microsoft.Web/connections/*/read",
        "Microsoft.Web/customApis/*/read",
        "Microsoft.Web/serverFarms/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Logic App Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Identity


### Managed Identity Contributor

Create, Read, Update, and Delete User Assigned Identity

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ManagedIdentity/userAssignedIdentities/read | Gets an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/write | Creates a new user assigned identity or updates the tags associated with an existing user assigned identity |
> | Microsoft.ManagedIdentity/userAssignedIdentities/delete | Deletes an existing user assigned identity |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create, Read, Update, and Delete User Assigned Identity",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/e40ec5ca-96e0-45a2-b4ff-59039f2c2b59",
  "name": "e40ec5ca-96e0-45a2-b4ff-59039f2c2b59",
  "permissions": [
    {
      "actions": [
        "Microsoft.ManagedIdentity/userAssignedIdentities/read",
        "Microsoft.ManagedIdentity/userAssignedIdentities/write",
        "Microsoft.ManagedIdentity/userAssignedIdentities/delete",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Identity Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Managed Identity Operator

Read and Assign User Assigned Identity

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ManagedIdentity/userAssignedIdentities/*/read |  |
> | Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read and Assign User Assigned Identity",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/f1a07417-d97a-45cb-824c-7a7467783830",
  "name": "f1a07417-d97a-45cb-824c-7a7467783830",
  "permissions": [
    {
      "actions": [
        "Microsoft.ManagedIdentity/userAssignedIdentities/*/read",
        "Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Identity Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Security


### Azure Sentinel Contributor

Azure Sentinel Contributor

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.SecurityInsights/* |  |
> | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/*/read | View log analytics data |
> | Microsoft.OperationalInsights/workspaces/savedSearches/* |  |
> | Microsoft.OperationsManagement/solutions/read | Get exiting OMS solution |
> | Microsoft.OperationalInsights/workspaces/query/read | Run queries over the data in the workspace |
> | Microsoft.OperationalInsights/workspaces/query/*/read |  |
> | Microsoft.OperationalInsights/workspaces/dataSources/read | Get datasources under a workspace. |
> | Microsoft.Insights/workbooks/* |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Azure Sentinel Contributor",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ab8e14d6-4a74-4a29-9ba8-549422addade",
  "name": "ab8e14d6-4a74-4a29-9ba8-549422addade",
  "permissions": [
    {
      "actions": [
        "Microsoft.SecurityInsights/*",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/savedSearches/*",
        "Microsoft.OperationsManagement/solutions/read",
        "Microsoft.OperationalInsights/workspaces/query/read",
        "Microsoft.OperationalInsights/workspaces/query/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.Insights/workbooks/*",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Sentinel Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Sentinel Reader

Azure Sentinel Reader

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.SecurityInsights/*/read |  |
> | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/*/read | View log analytics data |
> | Microsoft.OperationalInsights/workspaces/LinkedServices/read | Get linked services under given workspace. |
> | Microsoft.OperationalInsights/workspaces/savedSearches/read | Gets a saved search query |
> | Microsoft.OperationsManagement/solutions/read | Get exiting OMS solution |
> | Microsoft.OperationalInsights/workspaces/query/read | Run queries over the data in the workspace |
> | Microsoft.OperationalInsights/workspaces/query/*/read |  |
> | Microsoft.OperationalInsights/workspaces/dataSources/read | Get datasources under a workspace. |
> | Microsoft.Insights/workbooks/read | Read a workbook |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Azure Sentinel Reader",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8d289c81-5878-46d4-8554-54e1e3d8b5cb",
  "name": "8d289c81-5878-46d4-8554-54e1e3d8b5cb",
  "permissions": [
    {
      "actions": [
        "Microsoft.SecurityInsights/*/read",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/LinkedServices/read",
        "Microsoft.OperationalInsights/workspaces/savedSearches/read",
        "Microsoft.OperationsManagement/solutions/read",
        "Microsoft.OperationalInsights/workspaces/query/read",
        "Microsoft.OperationalInsights/workspaces/query/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.Insights/workbooks/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Sentinel Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Sentinel Responder

Azure Sentinel Responder

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.SecurityInsights/*/read |  |
> | Microsoft.SecurityInsights/cases/* |  |
> | Microsoft.SecurityInsights/incidents/* |  |
> | Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
> | Microsoft.OperationalInsights/workspaces/*/read | View log analytics data |
> | Microsoft.OperationalInsights/workspaces/dataSources/read | Get datasources under a workspace. |
> | Microsoft.OperationalInsights/workspaces/savedSearches/read | Gets a saved search query |
> | Microsoft.OperationsManagement/solutions/read | Get exiting OMS solution |
> | Microsoft.OperationalInsights/workspaces/query/read | Run queries over the data in the workspace |
> | Microsoft.OperationalInsights/workspaces/query/*/read |  |
> | Microsoft.OperationalInsights/workspaces/dataSources/read | Get datasources under a workspace. |
> | Microsoft.Insights/workbooks/read | Read a workbook |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Azure Sentinel Responder",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/3e150937-b8fe-4cfb-8069-0eaf05ecd056",
  "name": "3e150937-b8fe-4cfb-8069-0eaf05ecd056",
  "permissions": [
    {
      "actions": [
        "Microsoft.SecurityInsights/*/read",
        "Microsoft.SecurityInsights/cases/*",
        "Microsoft.SecurityInsights/incidents/*",
        "Microsoft.OperationalInsights/workspaces/analytics/query/action",
        "Microsoft.OperationalInsights/workspaces/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.OperationalInsights/workspaces/savedSearches/read",
        "Microsoft.OperationsManagement/solutions/read",
        "Microsoft.OperationalInsights/workspaces/query/read",
        "Microsoft.OperationalInsights/workspaces/query/*/read",
        "Microsoft.OperationalInsights/workspaces/dataSources/read",
        "Microsoft.Insights/workbooks/read",
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Sentinel Responder",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Key Vault Contributor

Lets you manage key vaults, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.KeyVault/* |  |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | Microsoft.KeyVault/locations/deletedVaults/purge/action | Purge a soft deleted key vault |
> | Microsoft.KeyVault/hsmPools/* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage key vaults, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/f25e0fa2-a7c8-4377-a976-54943a77a395",
  "name": "f25e0fa2-a7c8-4377-a976-54943a77a395",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.KeyVault/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [
        "Microsoft.KeyVault/locations/deletedVaults/purge/action",
        "Microsoft.KeyVault/hsmPools/*"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Key Vault Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Security Admin

Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Authorization/policyAssignments/* | Create and manage policy assignments |
> | Microsoft.Authorization/policyDefinitions/* | Create and manage policy definitions |
> | Microsoft.Authorization/policySetDefinitions/* | Create and manage policy sets |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | Microsoft.operationalInsights/workspaces/*/read | View log analytics data |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Security/* | Create and manage security components and policies |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Security Admin Role",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/fb1c8493-542b-48eb-b624-b4c8fea62acd",
  "name": "fb1c8493-542b-48eb-b624-b4c8fea62acd",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Authorization/policyAssignments/*",
        "Microsoft.Authorization/policyDefinitions/*",
        "Microsoft.Authorization/policySetDefinitions/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.operationalInsights/workspaces/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Security/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Admin",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Security Assessment Contributor

Lets you push assessments to Security Center

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Security/assessments/write | Create or update security assessments on your subscription |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you push assessments to Security Center",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/612c2aa1-cb24-443b-ac28-3ab7272de6f5",
  "name": "612c2aa1-cb24-443b-ac28-3ab7272de6f5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Security/assessments/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Assessment Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Security Manager (Legacy)

This is a legacy role. Please use Security Admin instead.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.ClassicCompute/*/read | Read configuration information classic virtual machines |
> | Microsoft.ClassicCompute/virtualMachines/*/write | Write configuration for classic virtual machines |
> | Microsoft.ClassicNetwork/*/read | Read configuration information about classic network |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Security/* | Create and manage security components and policies |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "This is a legacy role. Please use Security Administrator instead",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/e3d13bf0-dd5a-482e-ba6b-9b8433878d10",
  "name": "e3d13bf0-dd5a-482e-ba6b-9b8433878d10",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.ClassicCompute/*/read",
        "Microsoft.ClassicCompute/virtualMachines/*/write",
        "Microsoft.ClassicNetwork/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Security/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Manager (Legacy)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Security Reader

Can view recommendations and alerts, view security policies, view security states, but cannot make changes.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.operationalInsights/workspaces/*/read | View log analytics data |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Security/*/read | Read security components and policies |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Security Reader Role",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/39bc4728-0917-49c7-9d2c-d95423bc2eb4",
  "name": "39bc4728-0917-49c7-9d2c-d95423bc2eb4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.operationalInsights/workspaces/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Security/*/read",
        "Microsoft.Support/*",
        "Microsoft.Management/managementGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Security Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## DevOps


### DevTest Labs User

Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Compute/availabilitySets/read | Get the properties of an availability set |
> | Microsoft.Compute/virtualMachines/*/read | Read the properties of a virtual machine (VM sizes, runtime status, VM extensions, etc.) |
> | Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
> | Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
> | Microsoft.Compute/virtualMachines/restart/action | Restarts the virtual machine |
> | Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
> | Microsoft.DevTestLab/*/read | Read the properties of a lab |
> | Microsoft.DevTestLab/labs/claimAnyVm/action | Claim a random claimable virtual machine in the lab. |
> | Microsoft.DevTestLab/labs/createEnvironment/action | Create virtual machines in a lab. |
> | Microsoft.DevTestLab/labs/ensureCurrentUserProfile/action | Ensure the current user has a valid profile in the lab. |
> | Microsoft.DevTestLab/labs/formulas/delete | Delete formulas. |
> | Microsoft.DevTestLab/labs/formulas/read | Read formulas. |
> | Microsoft.DevTestLab/labs/formulas/write | Add or modify formulas. |
> | Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action | Evaluates lab policy. |
> | Microsoft.DevTestLab/labs/virtualMachines/claim/action | Take ownership of an existing virtual machine |
> | Microsoft.DevTestLab/labs/virtualmachines/listApplicableSchedules/action | Lists the applicable start/stop schedules, if any. |
> | Microsoft.DevTestLab/labs/virtualMachines/getRdpFileContents/action | Gets a string that represents the contents of the RDP file for the virtual machine |
> | Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool. Not Alertable. |
> | Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule. Not Alertable. |
> | Microsoft.Network/networkInterfaces/*/read | Read the properties of a network interface (for example, all the load balancers that the network interface is a part of) |
> | Microsoft.Network/networkInterfaces/join/action | Joins a Virtual Machine to a network interface. Not Alertable. |
> | Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
> | Microsoft.Network/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
> | Microsoft.Network/publicIPAddresses/*/read | Read the properties of a public IP address |
> | Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address. Not Alertable. |
> | Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
> | Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network. Not Alertable. |
> | Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
> | Microsoft.Resources/deployments/read | Gets or lists deployments. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
> | **NotActions** |  |
> | Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/76283e04-6283-4c54-8f91-bcf1374a3c64",
  "name": "76283e04-6283-4c54-8f91-bcf1374a3c64",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Compute/availabilitySets/read",
        "Microsoft.Compute/virtualMachines/*/read",
        "Microsoft.Compute/virtualMachines/deallocate/action",
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Compute/virtualMachines/restart/action",
        "Microsoft.Compute/virtualMachines/start/action",
        "Microsoft.DevTestLab/*/read",
        "Microsoft.DevTestLab/labs/claimAnyVm/action",
        "Microsoft.DevTestLab/labs/createEnvironment/action",
        "Microsoft.DevTestLab/labs/ensureCurrentUserProfile/action",
        "Microsoft.DevTestLab/labs/formulas/delete",
        "Microsoft.DevTestLab/labs/formulas/read",
        "Microsoft.DevTestLab/labs/formulas/write",
        "Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action",
        "Microsoft.DevTestLab/labs/virtualMachines/claim/action",
        "Microsoft.DevTestLab/labs/virtualmachines/listApplicableSchedules/action",
        "Microsoft.DevTestLab/labs/virtualMachines/getRdpFileContents/action",
        "Microsoft.Network/loadBalancers/backendAddressPools/join/action",
        "Microsoft.Network/loadBalancers/inboundNatRules/join/action",
        "Microsoft.Network/networkInterfaces/*/read",
        "Microsoft.Network/networkInterfaces/join/action",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/publicIPAddresses/*/read",
        "Microsoft.Network/publicIPAddresses/join/action",
        "Microsoft.Network/publicIPAddresses/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Resources/deployments/operations/read",
        "Microsoft.Resources/deployments/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/listKeys/action"
      ],
      "notActions": [
        "Microsoft.Compute/virtualMachines/vmSizes/read"
      ],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "DevTest Labs User",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Lab Creator

Lets you create, manage, delete your managed labs under your Azure Lab Accounts.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.LabServices/labAccounts/*/read |  |
> | Microsoft.LabServices/labAccounts/createLab/action | Create a lab in a lab account. |
> | Microsoft.LabServices/labAccounts/sizes/getRegionalAvailability/action |  |
> | Microsoft.LabServices/labAccounts/getRegionalAvailability/action | Get regional availability information for each size category configured under a lab account |
> | Microsoft.LabServices/labAccounts/getPricingAndAvailability/action | Get the pricing and availability of combinations of sizes, geographies, and operating systems for the lab account. |
> | Microsoft.LabServices/labAccounts/getRestrictionsAndUsage/action | Get core restrictions and usage for this subscription |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create, manage, delete your managed labs under your Azure Lab Accounts.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b97fb8bc-a8b2-4522-a38b-dd33c7e65ead",
  "name": "b97fb8bc-a8b2-4522-a38b-dd33c7e65ead",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.LabServices/labAccounts/*/read",
        "Microsoft.LabServices/labAccounts/createLab/action",
        "Microsoft.LabServices/labAccounts/sizes/getRegionalAvailability/action",
        "Microsoft.LabServices/labAccounts/getRegionalAvailability/action",
        "Microsoft.LabServices/labAccounts/getPricingAndAvailability/action",
        "Microsoft.LabServices/labAccounts/getRestrictionsAndUsage/action",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Lab Creator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Monitor


### Application Insights Component Contributor

Can manage Application Insights components

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage classic alert rules |
> | Microsoft.Insights/metricAlerts/* | Create and manage new alert rules |
> | Microsoft.Insights/components/* | Create and manage Insights components |
> | Microsoft.Insights/webtests/* | Create and manage Insights web tests |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage Application Insights components",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ae349356-3a1b-4a5e-921d-050484c6347e",
  "name": "ae349356-3a1b-4a5e-921d-050484c6347e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/metricAlerts/*",
        "Microsoft.Insights/components/*",
        "Microsoft.Insights/webtests/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Application Insights Component Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Application Insights Snapshot Debugger

Gives user permission to view and download debug snapshots collected with the Application Insights Snapshot Debugger. Note that these permissions are not included in the [Owner](#owner) or [Contributor](#contributor) roles.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/components/*/read |  |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Gives user permission to use Application Insights Snapshot Debugger features",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/08954f03-6346-4c2e-81c0-ec3a5cfae23b",
  "name": "08954f03-6346-4c2e-81c0-ec3a5cfae23b",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Insights/components/*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Application Insights Snapshot Debugger",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Monitoring Contributor

Can read all monitoring data and edit monitoring settings. See also [Get started with roles, permissions, and security with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security#built-in-monitoring-roles).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.AlertsManagement/alerts/* |  |
> | Microsoft.AlertsManagement/alertsSummary/* |  |
> | Microsoft.Insights/actiongroups/* |  |
> | Microsoft.Insights/activityLogAlerts/* |  |
> | Microsoft.Insights/AlertRules/* | Create and manage Insights alert rules |
> | Microsoft.Insights/components/* | Create and manage Insights components |
> | Microsoft.Insights/DiagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
> | Microsoft.Insights/eventtypes/* | List Activity Log events (management events) in a subscription. This permission is applicable to both programmatic and portal access to the Activity Log. |
> | Microsoft.Insights/LogDefinitions/* | This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
> | Microsoft.Insights/metricalerts/* |  |
> | Microsoft.Insights/MetricDefinitions/* | Read metric definitions (list of available metric types for a resource). |
> | Microsoft.Insights/Metrics/* | Read metrics for a resource. |
> | Microsoft.Insights/Register/Action | Register the Microsoft Insights provider |
> | Microsoft.Insights/scheduledqueryrules/* |  |
> | Microsoft.Insights/webtests/* | Create and manage Insights web tests |
> | Microsoft.Insights/workbooks/* |  |
> | Microsoft.OperationalInsights/workspaces/intelligencepacks/* | Read/write/delete log analytics solution packs. |
> | Microsoft.OperationalInsights/workspaces/savedSearches/* | Read/write/delete log analytics saved searches. |
> | Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
> | Microsoft.OperationalInsights/workspaces/sharedKeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
> | Microsoft.OperationalInsights/workspaces/storageinsightconfigs/* | Read/write/delete log analytics storage insight configurations. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.WorkloadMonitor/monitors/* |  |
> | Microsoft.WorkloadMonitor/notificationSettings/* |  |
> | Microsoft.AlertsManagement/smartDetectorAlertRules/* |  |
> | Microsoft.AlertsManagement/actionRules/* |  |
> | Microsoft.AlertsManagement/smartGroups/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read all monitoring data and update monitoring settings.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/749f88d5-cbae-40b8-bcfc-e573ddc772fa",
  "name": "749f88d5-cbae-40b8-bcfc-e573ddc772fa",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.AlertsManagement/alerts/*",
        "Microsoft.AlertsManagement/alertsSummary/*",
        "Microsoft.Insights/actiongroups/*",
        "Microsoft.Insights/activityLogAlerts/*",
        "Microsoft.Insights/AlertRules/*",
        "Microsoft.Insights/components/*",
        "Microsoft.Insights/DiagnosticSettings/*",
        "Microsoft.Insights/eventtypes/*",
        "Microsoft.Insights/LogDefinitions/*",
        "Microsoft.Insights/metricalerts/*",
        "Microsoft.Insights/MetricDefinitions/*",
        "Microsoft.Insights/Metrics/*",
        "Microsoft.Insights/Register/Action",
        "Microsoft.Insights/scheduledqueryrules/*",
        "Microsoft.Insights/webtests/*",
        "Microsoft.Insights/workbooks/*",
        "Microsoft.OperationalInsights/workspaces/intelligencepacks/*",
        "Microsoft.OperationalInsights/workspaces/savedSearches/*",
        "Microsoft.OperationalInsights/workspaces/search/action",
        "Microsoft.OperationalInsights/workspaces/sharedKeys/action",
        "Microsoft.OperationalInsights/workspaces/storageinsightconfigs/*",
        "Microsoft.Support/*",
        "Microsoft.WorkloadMonitor/monitors/*",
        "Microsoft.WorkloadMonitor/notificationSettings/*",
        "Microsoft.AlertsManagement/smartDetectorAlertRules/*",
        "Microsoft.AlertsManagement/actionRules/*",
        "Microsoft.AlertsManagement/smartGroups/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Monitoring Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Monitoring Metrics Publisher

Enables publishing metrics against Azure resources

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Insights/Register/Action | Register the Microsoft Insights provider |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.Insights/Metrics/Write | Write metrics |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Enables publishing metrics against Azure resources",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/3913510d-42f4-4e42-8a64-420c390055eb",
  "name": "3913510d-42f4-4e42-8a64-420c390055eb",
  "permissions": [
    {
      "actions": [
        "Microsoft.Insights/Register/Action",
        "Microsoft.Support/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.Insights/Metrics/Write"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Monitoring Metrics Publisher",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Monitoring Reader

Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/roles-permissions-security#built-in-monitoring-roles).

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read all monitoring data.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/43d0d8ad-25c7-4714-9337-8ba259a9fe05",
  "name": "43d0d8ad-25c7-4714-9337-8ba259a9fe05",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.OperationalInsights/workspaces/search/action",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Monitoring Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Workbook Contributor

Can save shared workbooks.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Insights/workbooks/write | Create or update a workbook |
> | Microsoft.Insights/workbooks/delete | Delete a workbook |
> | Microsoft.Insights/workbooks/read | Read a workbook |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can save shared workbooks.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/e8ddcd69-c73f-4f9f-9844-4100522f16ad",
  "name": "e8ddcd69-c73f-4f9f-9844-4100522f16ad",
  "permissions": [
    {
      "actions": [
        "Microsoft.Insights/workbooks/write",
        "Microsoft.Insights/workbooks/delete",
        "Microsoft.Insights/workbooks/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Workbook Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Workbook Reader

Can read workbooks.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | microsoft.insights/workbooks/read | Read a workbook |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read workbooks.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b279062a-9be3-42a0-92ae-8b3cf002ec4d",
  "name": "b279062a-9be3-42a0-92ae-8b3cf002ec4d",
  "permissions": [
    {
      "actions": [
        "microsoft.insights/workbooks/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Workbook Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Management + governance


### Automation Job Operator

Create and Manage Jobs using Automation Runbooks.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
> | Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/output/read | Gets the output of a job |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Create and Manage Jobs using Automation Runbooks.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4fe576fe-1146-4730-92eb-48519fa6bf9f",
  "name": "4fe576fe-1146-4730-92eb-48519fa6bf9f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read",
        "Microsoft.Automation/automationAccounts/jobs/read",
        "Microsoft.Automation/automationAccounts/jobs/resume/action",
        "Microsoft.Automation/automationAccounts/jobs/stop/action",
        "Microsoft.Automation/automationAccounts/jobs/streams/read",
        "Microsoft.Automation/automationAccounts/jobs/suspend/action",
        "Microsoft.Automation/automationAccounts/jobs/write",
        "Microsoft.Automation/automationAccounts/jobs/output/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Job Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Automation Operator

Automation Operators are able to start, stop, suspend, and resume jobs

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
> | Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
> | Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
> | Microsoft.Automation/automationAccounts/jobSchedules/read | Gets an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/jobSchedules/write | Creates an Azure Automation job schedule |
> | Microsoft.Automation/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
> | Microsoft.Automation/automationAccounts/read | Gets an Azure Automation account |
> | Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | Microsoft.Automation/automationAccounts/schedules/read | Gets an Azure Automation schedule asset |
> | Microsoft.Automation/automationAccounts/schedules/write | Creates or updates an Azure Automation schedule asset |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Automation/automationAccounts/jobs/output/read | Gets the output of a job |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Automation Operators are able to start, stop, suspend, and resume jobs",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/d3881f73-407a-4167-8283-e981cbba0404",
  "name": "d3881f73-407a-4167-8283-e981cbba0404",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read",
        "Microsoft.Automation/automationAccounts/jobs/read",
        "Microsoft.Automation/automationAccounts/jobs/resume/action",
        "Microsoft.Automation/automationAccounts/jobs/stop/action",
        "Microsoft.Automation/automationAccounts/jobs/streams/read",
        "Microsoft.Automation/automationAccounts/jobs/suspend/action",
        "Microsoft.Automation/automationAccounts/jobs/write",
        "Microsoft.Automation/automationAccounts/jobSchedules/read",
        "Microsoft.Automation/automationAccounts/jobSchedules/write",
        "Microsoft.Automation/automationAccounts/linkedWorkspace/read",
        "Microsoft.Automation/automationAccounts/read",
        "Microsoft.Automation/automationAccounts/runbooks/read",
        "Microsoft.Automation/automationAccounts/schedules/read",
        "Microsoft.Automation/automationAccounts/schedules/write",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Automation/automationAccounts/jobs/output/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Automation Runbook Operator

Read Runbook properties - to be able to create Jobs of the runbook.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Read Runbook properties - to be able to create Jobs of the runbook.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5fb5aef8-1081-4b8e-bb16-9d5d0385bab5",
  "name": "5fb5aef8-1081-4b8e-bb16-9d5d0385bab5",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Automation/automationAccounts/runbooks/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Automation Runbook Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Connected Machine Onboarding

Can onboard Azure Connected Machines.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.HybridCompute/machines/read | Read any Azure Arc machines |
> | Microsoft.HybridCompute/machines/write | Writes an Azure Arc machines |
> | Microsoft.GuestConfiguration/guestConfigurationAssignments/read | Get guest configuration assignment. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can onboard Azure Connected Machines.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b64e21ea-ac4e-4cdf-9dc9-5b892992bee7",
  "name": "b64e21ea-ac4e-4cdf-9dc9-5b892992bee7",
  "permissions": [
    {
      "actions": [
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.GuestConfiguration/guestConfigurationAssignments/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Connected Machine Onboarding",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Azure Connected Machine Resource Administrator

Can read, write, delete and re-onboard Azure Connected Machines.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.HybridCompute/machines/read | Read any Azure Arc machines |
> | Microsoft.HybridCompute/machines/write | Writes an Azure Arc machines |
> | Microsoft.HybridCompute/machines/delete | Deletes an Azure Arc machines |
> | Microsoft.HybridCompute/machines/reconnect/action | Reconnects an Azure Arc machines |
> | Microsoft.HybridCompute/machines/extensions/write | Installs or Updates an Azure Arc extensions |
> | Microsoft.HybridCompute/*/read |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can read, write, delete and re-onboard Azure Connected Machines.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/cd570a14-e51a-42ad-bac8-bafd67325302",
  "name": "cd570a14-e51a-42ad-bac8-bafd67325302",
  "permissions": [
    {
      "actions": [
        "Microsoft.HybridCompute/machines/read",
        "Microsoft.HybridCompute/machines/write",
        "Microsoft.HybridCompute/machines/delete",
        "Microsoft.HybridCompute/machines/reconnect/action",
        "Microsoft.HybridCompute/machines/extensions/write",
        "Microsoft.HybridCompute/*/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Azure Connected Machine Resource Administrator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Billing Reader

Allows read access to billing data

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Billing/*/read | Read Billing information |
> | Microsoft.Commerce/*/read |  |
> | Microsoft.Consumption/*/read |  |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | Microsoft.CostManagement/*/read |  |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read access to billing data",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
  "name": "fa23ad8b-c56e-40d8-ac0c-ce449e1d2c64",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Billing/*/read",
        "Microsoft.Commerce/*/read",
        "Microsoft.Consumption/*/read",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.CostManagement/*/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Billing Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Blueprint Contributor

Can manage blueprint definitions, but not assign them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Blueprint/blueprints/* | Create and manage blueprint definitions or blueprint artifacts. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can manage blueprint definitions, but not assign them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/41077137-e803-4205-871c-5a86e6a753b4",
  "name": "41077137-e803-4205-871c-5a86e6a753b4",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Blueprint/blueprints/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Blueprint Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Blueprint Operator

Can assign existing published blueprints, but cannot create new blueprints. Note that this only works if the assignment is done with a user-assigned managed identity.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Blueprint/blueprintAssignments/* | Create and manage blueprint assignments. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can assign existing published blueprints, but cannot create new blueprints. NOTE: this only works if the assignment is done with a user-assigned managed identity.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/437d2ced-4a38-4302-8479-ed2bcb43d090",
  "name": "437d2ced-4a38-4302-8479-ed2bcb43d090",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Blueprint/blueprintAssignments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Blueprint Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Cost Management Contributor

Can view costs and manage cost configuration (e.g. budgets, exports)

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Consumption/* |  |
> | Microsoft.CostManagement/* |  |
> | Microsoft.Billing/billingPeriods/read |  |
> | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Advisor/configurations/read | Get configurations |
> | Microsoft.Advisor/recommendations/read | Reads recommendations |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can view costs and manage cost configuration (e.g. budgets, exports)",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/434105ed-43f6-45c7-a02f-909b2ba83430",
  "name": "434105ed-43f6-45c7-a02f-909b2ba83430",
  "permissions": [
    {
      "actions": [
        "Microsoft.Consumption/*",
        "Microsoft.CostManagement/*",
        "Microsoft.Billing/billingPeriods/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Advisor/configurations/read",
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Management/managementGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cost Management Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Cost Management Reader

Can view cost data and configuration (e.g. budgets, exports)

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Consumption/*/read |  |
> | Microsoft.CostManagement/*/read |  |
> | Microsoft.Billing/billingPeriods/read |  |
> | Microsoft.Resources/subscriptions/read | Gets the list of subscriptions. |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Advisor/configurations/read | Get configurations |
> | Microsoft.Advisor/recommendations/read | Reads recommendations |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Can view cost data and configuration (e.g. budgets, exports)",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/72fafb9e-0641-4937-9268-a91bfd8191a3",
  "name": "72fafb9e-0641-4937-9268-a91bfd8191a3",
  "permissions": [
    {
      "actions": [
        "Microsoft.Consumption/*/read",
        "Microsoft.CostManagement/*/read",
        "Microsoft.Billing/billingPeriods/read",
        "Microsoft.Resources/subscriptions/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "Microsoft.Advisor/configurations/read",
        "Microsoft.Advisor/recommendations/read",
        "Microsoft.Management/managementGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Cost Management Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Managed Application Contributor Role

Allows for creating managed application resources.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.Solutions/applications/* |  |
> | Microsoft.Solutions/register/action | Register to Solutions. |
> | Microsoft.Resources/subscriptions/resourceGroups/* |  |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows for creating managed application resources.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/641177b8-a67a-45b9-a033-47bc880bb21e",
  "name": "641177b8-a67a-45b9-a033-47bc880bb21e",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Solutions/applications/*",
        "Microsoft.Solutions/register/action",
        "Microsoft.Resources/subscriptions/resourceGroups/*",
        "Microsoft.Resources/deployments/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Application Contributor Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Managed Application Operator Role

Lets you read and perform actions on Managed Application resources

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.Solutions/applications/read | Retrieves a list of applications. |
> | Microsoft.Solutions/*/action |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read and perform actions on Managed Application resources",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/c7393b34-138c-406f-901b-d8cf2b17e6ae",
  "name": "c7393b34-138c-406f-901b-d8cf2b17e6ae",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Solutions/applications/read",
        "Microsoft.Solutions/*/action"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Application Operator Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Managed Applications Reader

Lets you read resources in a managed app and request JIT access.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Solutions/jitRequests/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you read resources in a managed app and request JIT access.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/b9331d33-8a36-4f8c-b097-4f54124fdb44",
  "name": "b9331d33-8a36-4f8c-b097-4f54124fdb44",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Solutions/jitRequests/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Applications Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Managed Services Registration assignment Delete Role

Managed Services Registration Assignment Delete Role allows the managing tenant users to delete the registration assignment assigned to their tenant.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.ManagedServices/registrationAssignments/read | Retrieves a list of Managed Services registration assignments. |
> | Microsoft.ManagedServices/registrationAssignments/delete | Removes Managed Services registration assignment. |
> | Microsoft.ManagedServices/operationStatuses/read | Reads the operation status for the resource. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Managed Services Registration Assignment Delete Role allows the managing tenant users to delete the registration assignment assigned to their tenant.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/91c1777a-f3dc-4fae-b103-61d183457e46",
  "name": "91c1777a-f3dc-4fae-b103-61d183457e46",
  "permissions": [
    {
      "actions": [
        "Microsoft.ManagedServices/registrationAssignments/read",
        "Microsoft.ManagedServices/registrationAssignments/delete",
        "Microsoft.ManagedServices/operationStatuses/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Managed Services Registration assignment Delete Role",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Management Group Contributor

Management Group Contributor Role

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Management/managementGroups/delete | Delete management group. |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | Microsoft.Management/managementGroups/subscriptions/delete | De-associates subscription from the management group. |
> | Microsoft.Management/managementGroups/subscriptions/write | Associates existing subscription with the management group. |
> | Microsoft.Management/managementGroups/write | Create or update a management group. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Management Group Contributor Role",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c",
  "name": "5d58bcaf-24a5-4b20-bdb6-eed9f69fbe4c",
  "permissions": [
    {
      "actions": [
        "Microsoft.Management/managementGroups/delete",
        "Microsoft.Management/managementGroups/read",
        "Microsoft.Management/managementGroups/subscriptions/delete",
        "Microsoft.Management/managementGroups/subscriptions/write",
        "Microsoft.Management/managementGroups/write"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Management Group Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Management Group Reader

Management Group Reader Role

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Management Group Reader Role",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/ac63b705-f282-497d-ac71-919bf39d939d",
  "name": "ac63b705-f282-497d-ac71-919bf39d939d",
  "permissions": [
    {
      "actions": [
        "Microsoft.Management/managementGroups/read"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Management Group Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### New Relic APM Account Contributor

Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | NewRelic.APM/accounts/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5d28c62d-5b37-4476-8438-e587778df237",
  "name": "5d28c62d-5b37-4476-8438-e587778df237",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*",
        "NewRelic.APM/accounts/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "New Relic APM Account Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Policy Insights Data Writer (Preview)

Allows read access to resource policies and write access to resource component policy events.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/policyassignments/read | Get information about a policy assignment. |
> | Microsoft.Authorization/policydefinitions/read | Get information about a policy definition. |
> | Microsoft.Authorization/policysetdefinitions/read | Get information about a policy set definition. |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | Microsoft.PolicyInsights/checkDataPolicyCompliance/action | Check the compliance status of a given component against data policies. |
> | Microsoft.PolicyInsights/policyEvents/logDataEvents/action | Log the resource component policy events. |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Allows read access to resource policies and write access to resource component policy events.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/66bb4e9e-b016-4a94-8249-4c0511c2be84",
  "name": "66bb4e9e-b016-4a94-8249-4c0511c2be84",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/policyassignments/read",
        "Microsoft.Authorization/policydefinitions/read",
        "Microsoft.Authorization/policysetdefinitions/read"
      ],
      "notActions": [],
      "dataActions": [
        "Microsoft.PolicyInsights/checkDataPolicyCompliance/action",
        "Microsoft.PolicyInsights/policyEvents/logDataEvents/action"
      ],
      "notDataActions": []
    }
  ],
  "roleName": "Policy Insights Data Writer (Preview)",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Resource Policy Contributor

Users with rights to create/modify resource policy, create support ticket and read resources/hierarchy.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | */read | Read resources of all types, except secrets. |
> | Microsoft.Authorization/policyassignments/* | Create and manage policy assignments |
> | Microsoft.Authorization/policydefinitions/* | Create and manage policy definitions |
> | Microsoft.Authorization/policysetdefinitions/* | Create and manage policy sets |
> | Microsoft.PolicyInsights/* |  |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Users with rights to create/modify resource policy, create support ticket and read resources/hierarchy.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/36243c78-bf99-498c-9df9-86d9f8d28608",
  "name": "36243c78-bf99-498c-9df9-86d9f8d28608",
  "permissions": [
    {
      "actions": [
        "*/read",
        "Microsoft.Authorization/policyassignments/*",
        "Microsoft.Authorization/policydefinitions/*",
        "Microsoft.Authorization/policysetdefinitions/*",
        "Microsoft.PolicyInsights/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Resource Policy Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Site Recovery Contributor

Lets you manage Site Recovery service except vault creation and role assignment

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/* | Create and manage registered identities |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/* | Create or Update replication alert settings |
> | Microsoft.RecoveryServices/vaults/replicationEvents/read | Read any Events |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/* | Create and manage replication fabrics |
> | Microsoft.RecoveryServices/vaults/replicationJobs/* | Create and manage replication jobs |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/* | Create and manage replication policies |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/* | Create and manage recovery plans |
> | Microsoft.RecoveryServices/Vaults/storageConfig/* | Create and manage storage configuration of Recovery Services vault |
> | Microsoft.RecoveryServices/Vaults/tokenInfo/read |  |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read |  |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.RecoveryServices/vaults/replicationOperationStatus/read | Read any Vault Replication Operation Status |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Site Recovery service except vault creation and role assignment",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/6670b86e-a3f7-4917-ac9b-5d6ab1be4567",
  "name": "6670b86e-a3f7-4917-ac9b-5d6ab1be4567",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/locations/allocateStamp/action",
        "Microsoft.RecoveryServices/Vaults/certificates/write",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/*",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/refreshContainers/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/*",
        "Microsoft.RecoveryServices/vaults/replicationAlertSettings/*",
        "Microsoft.RecoveryServices/vaults/replicationEvents/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/*",
        "Microsoft.RecoveryServices/vaults/replicationJobs/*",
        "Microsoft.RecoveryServices/vaults/replicationPolicies/*",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/*",
        "Microsoft.RecoveryServices/Vaults/storageConfig/*",
        "Microsoft.RecoveryServices/Vaults/tokenInfo/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/vaultTokens/read",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/*",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.RecoveryServices/vaults/replicationOperationStatus/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Site Recovery Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Site Recovery Operator

Lets you failover and failback but not perform other Site Recovery management operations

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | Microsoft.RecoveryServices/vaults/replicationEvents/read | Read any Events |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action | Checks Consistency of the Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action | Reassociate Gateway |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action | Renew Certificate for Fabric |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action | ReProtect Protected Item |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action | Switch Protection Container |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action | Test Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action | Refresh Provider |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationJobs/* | Create and manage replication jobs |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read any Policies |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action | Failover Commit Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action | Planned Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action | ReProtect Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action | Test Failover Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Test Failover Cleanup Recovery Plan |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action | Failover Recovery Plan |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read |  |
> | Microsoft.RecoveryServices/Vaults/storageConfig/read |  |
> | Microsoft.RecoveryServices/Vaults/tokenInfo/read |  |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you failover and failback but not perform other Site Recovery management operations",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/494ae006-db33-4328-bf46-533a6560a3ca",
  "name": "494ae006-db33-4328-bf46-533a6560a3ca",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Network/virtualNetworks/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/locations/allocateStamp/action",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/read",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/refreshContainers/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/read",
        "Microsoft.RecoveryServices/vaults/replicationAlertSettings/read",
        "Microsoft.RecoveryServices/vaults/replicationEvents/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/switchprotection/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read",
        "Microsoft.RecoveryServices/vaults/replicationJobs/*",
        "Microsoft.RecoveryServices/vaults/replicationPolicies/read",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/*",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read",
        "Microsoft.RecoveryServices/Vaults/storageConfig/read",
        "Microsoft.RecoveryServices/Vaults/tokenInfo/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/vaultTokens/read",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Site Recovery Operator",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Site Recovery Reader

Lets you view Site Recovery status but not perform other management operations

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
> | Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
> | Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
> | Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read |  |
> | Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
> | Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
> | Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
> | Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read any Alerts Settings |
> | Microsoft.RecoveryServices/vaults/replicationEvents/read | Read any Events |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read any Fabrics |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read any Networks |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read any Network Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read | Read any Protection Containers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Read any Protectable Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Read any Protected Items |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read any Replication Recovery Points |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read any Protection Container Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read any Recovery Services Providers |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read | Read any Storage Classifications |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read any Storage Classification Mappings |
> | Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read any vCenters |
> | Microsoft.RecoveryServices/vaults/replicationJobs/read | Read any Jobs |
> | Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read any Policies |
> | Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read any Recovery Plans |
> | Microsoft.RecoveryServices/Vaults/storageConfig/read |  |
> | Microsoft.RecoveryServices/Vaults/tokenInfo/read |  |
> | Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
> | Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you view Site Recovery status but not perform other management operations",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/dbaa88c4-0c30-4179-9fb3-46319faa6149",
  "name": "dbaa88c4-0c30-4179-9fb3-46319faa6149",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.RecoveryServices/locations/allocatedStamp/read",
        "Microsoft.RecoveryServices/Vaults/extendedInformation/read",
        "Microsoft.RecoveryServices/Vaults/monitoringAlerts/read",
        "Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read",
        "Microsoft.RecoveryServices/Vaults/read",
        "Microsoft.RecoveryServices/Vaults/refreshContainers/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read",
        "Microsoft.RecoveryServices/Vaults/registeredIdentities/read",
        "Microsoft.RecoveryServices/vaults/replicationAlertSettings/read",
        "Microsoft.RecoveryServices/vaults/replicationEvents/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read",
        "Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read",
        "Microsoft.RecoveryServices/vaults/replicationJobs/read",
        "Microsoft.RecoveryServices/vaults/replicationPolicies/read",
        "Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read",
        "Microsoft.RecoveryServices/Vaults/storageConfig/read",
        "Microsoft.RecoveryServices/Vaults/tokenInfo/read",
        "Microsoft.RecoveryServices/Vaults/usages/read",
        "Microsoft.RecoveryServices/Vaults/vaultTokens/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Site Recovery Reader",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Support Request Contributor

Lets you create and manage Support requests

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you create and manage Support requests",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
  "name": "cfd33db0-3dd1-45e3-aa9d-cdbdf3b6f24e",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Support Request Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Tag Contributor

Lets you manage tags on entities, without providing access to the entities themselves.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Resources/subscriptions/resourceGroups/resources/read | Gets the resources for the resource group. |
> | Microsoft.Resources/subscriptions/resources/read | Gets resources of a subscription. |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.Support/* | Create and manage support tickets |
> | Microsoft.Resources/tags/* |  |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage tags on entities, without providing access to the entities themselves.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/4a9ae827-6dc8-4573-8ac7-8239d42aa03f",
  "name": "4a9ae827-6dc8-4573-8ac7-8239d42aa03f",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Resources/subscriptions/resourceGroups/resources/read",
        "Microsoft.Resources/subscriptions/resources/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*",
        "Microsoft.Resources/tags/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Tag Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Other


### BizTalk Contributor

Lets you manage BizTalk services, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.BizTalkServices/BizTalk/* | Create and manage BizTalk services |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage BizTalk services, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/5e3c6656-6cfa-4708-81fe-0de47ac73342",
  "name": "5e3c6656-6cfa-4708-81fe-0de47ac73342",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.BizTalkServices/BizTalk/*",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "BizTalk Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

### Scheduler Job Collections Contributor

Lets you manage Scheduler job collections, but not access to them.

> [!div class="mx-tableFixed"]
> |  |  |
> | --- | --- |
> | **Actions** |  |
> | Microsoft.Authorization/*/read | Read roles and role assignments |
> | Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
> | Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
> | Microsoft.Resources/deployments/* | Create and manage resource group deployments |
> | Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
> | Microsoft.Scheduler/jobcollections/* | Create and manage job collections |
> | Microsoft.Support/* | Create and manage support tickets |
> | **NotActions** |  |
> | *none* |  |
> | **DataActions** |  |
> | *none* |  |
> | **NotDataActions** |  |
> | *none* |  |

```json
{
  "assignableScopes": [
    "/"
  ],
  "description": "Lets you manage Scheduler job collections, but not access to them.",
  "id": "/subscriptions/{subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/188a0f2f-5c9e-469b-ae67-2aa5ce574b94",
  "name": "188a0f2f-5c9e-469b-ae67-2aa5ce574b94",
  "permissions": [
    {
      "actions": [
        "Microsoft.Authorization/*/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.ResourceHealth/availabilityStatuses/read",
        "Microsoft.Resources/deployments/*",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Scheduler/jobcollections/*",
        "Microsoft.Support/*"
      ],
      "notActions": [],
      "dataActions": [],
      "notDataActions": []
    }
  ],
  "roleName": "Scheduler Job Collections Contributor",
  "roleType": "BuiltInRole",
  "type": "Microsoft.Authorization/roleDefinitions"
}
```

## Next steps

- [Match resource provider to service](../azure-resource-manager/management/azure-services-resource-providers.md)
- [Azure custom roles](custom-roles.md)
- [Permissions in Azure Security Center](../security-center/security-center-permissions.md)
