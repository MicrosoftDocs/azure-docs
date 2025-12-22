---
title: Manage Entra ID enabled Azure HDInsight clusters with ARM template
description: Learn how to manage Entra ID enabled Azure HDInsight clusters with ARM template
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 08/20/2025
---

# Manage Entra ID-enabled Azure HDInsight clusters with ARM templates

Azure HDInsight now supports integration with Microsoft Entra ID, enabling secure, role-based access control and simplified identity management for your big data workloads. 
By using Azure Resource Manager (ARM) templates, you can deploy and manage Entra ID-enabled HDInsight clusters in a repeatable, automated, and consistent way. 
In this guide, you’ll learn how to set up ARM template resources and configure Entra ID. You’ll also see how to manage clusters at scale while meeting your organization’s security and governance rules.

## Prerequisites

  Before you begin, ensure you have the following resources:

  * Azure subscription with sufficient permissions to deploy resources.

  * Microsoft Entra ID tenant configured and accessible.

  * Service principal or managed identity with the necessary role assignments (for example, Contributor and User Access Administrator) to create and manage HDInsight clusters.

  * Azure CLI, PowerShell, or Azure portal access to validate deployment and monitor cluster status.

  * ARM template and parameter files that define the cluster configuration and Entra ID integration settings.

## ARM template resource definition

The clusters resource type can be deployed with operations that target **Resource groups** - See [resource group deployment commands](/azure/azure-resource-manager/templates/deploy-to-resource-group)

For a list of changed properties in each API version, see [change log](/azure/templates/microsoft.hdinsight/change-log/clusters).

## Resource format

To create a Microsoft.HDInsight/clusters resource, add the following JSON to your template.

```json
				{
					"$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
					"contentVersion": "0.9.0.0",
					"parameters": {
						"clusterName": {
							"type": "string",
							"metadata": {
								"description": "The name of the HDInsight cluster to create."
							}
						},
						"location": {
							"type": "string",
							"defaultValue": "eastus2euap",
							"metadata": {
								"description": "The location where all azure resources will be deployed."
							}
						},
						"clusterVersion": {
							"type": "string",
							"defaultValue": "5.1",
							"metadata": {
								"description": "HDInsight cluster version."
							}
						},
						"clusterWorkerNodeCount": {
							"type": "int",
							"defaultValue": 4,
							"metadata": {
								"description": "The number of nodes in the HDInsight cluster."
							}
						},
						"clusterKind": {
							"type": "string",
							"defaultValue": "SPARK",
							"metadata": {
								"description": "The type of the HDInsight cluster to create."
							}
						},
						"sshUserName": {
							"type": "string",
							"defaultValue": "sshuser",
							"metadata": {
								"description": "These credentials can be used to remotely access the cluster."
							}
						},
						"clusterRestAuthEntraUsers": {
							"type": "string",
							"metadata": {
								"description": "These Micrsoft Entra users can be used to submit jobs to the cluster and to log into cluster dashboards."
							}
						},
						"sshPassword": {
							"type": "securestring",
							"metadata": {
								"description": "The password must be at least 10 characters in length and must contain at least one digit, one non-alphanumeric character, and one upper or lower case letter."
							}
						},
						"minTlsVersionNumber": {
							"type": "string"
						},
						"isEncryptionInTransitEnabled": {
							"type": "bool"
						}
					},
					"resources": [
						{
							"apiVersion": "2025-01-15-preview",
							"name": "[parameters('clusterName')]",
							"type": "Microsoft.HDInsight/clusters",
							"location": "[parameters('location')]",
							"dependsOn": [],
							"tags": {},
							"zones": null,
							"properties": {
								"clusterVersion": "[parameters('clusterVersion')]",
								"osType": "Linux",
								"tier": "standard",
								"clusterDefinition": {
									"kind": "[parameters('clusterKind')]",
									"componentVersion": {
										"Spark": "3.3"
									},
									"configurations": {
										"gateway": {
											"restAuthCredential.isEnabled": false,
											"restAuthEntraUsers": "[parameters('clusterRestAuthEntraUsers')]"
										}
									}
								},
								"storageProfile": {
									"storageaccounts": [
										{
											"name": "<storageAccountName>.dfs.core.windows.net",
											"isDefault": true,
											"fileSystem": "hmgespark1-2025-10-06t08-34-17-604z",
											"resourceId": "/subscriptions/SubscriptionID>/resourceGroups/<resourceGroupName>/providers/Microsoft.Storage/storageAccounts/<MSIname>",
											"msiResourceId": "/subscriptions/<SubscriptionID>/resourcegroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSIname>",
											"enableSecureChannel": true
										}
									]
								},
								"computeProfile": {
									"roles": [
										{
											"autoscale": null,
											"name": "headnode",
											"minInstanceCount": 1,
											"targetInstanceCount": 2,
											"hardwareProfile": {
												"vmSize": "Standard_E8_V3"
											},
											"osProfile": {
												"linuxOperatingSystemProfile": {
													"username": "[parameters('sshUserName')]",
													"password": "[parameters('sshPassword')]"
												},
												"windowsOperatingSystemProfile": null
											},
											"virtualNetworkProfile": null,
											"scriptActions": [],
											"dataDisksGroups": null
										},
										{
											"autoscale": {
												"capacity": {
													"minInstanceCount": 4,
													"maxInstanceCount": 5
												},
												"recurrence": null
											},
											"name": "workernode",
											"targetInstanceCount": 4,
											"hardwareProfile": {
												"vmSize": "Standard_E8_V3"
											},
											"osProfile": {
												"linuxOperatingSystemProfile": {
													"username": "[parameters('sshUserName')]",
													"password": "[parameters('sshPassword')]"
												},
												"windowsOperatingSystemProfile": null
											},
											"virtualNetworkProfile": null,
											"scriptActions": [],
											"dataDisksGroups": null
										},
										{
											"autoscale": null,
											"name": "zookeepernode",
											"minInstanceCount": 1,
											"targetInstanceCount": 3,
											"hardwareProfile": {
												"vmSize": "Standard_A2_V2"
											},
											"osProfile": {
												"linuxOperatingSystemProfile": {
													"username": "[parameters('sshUserName')]",
													"password": "[parameters('sshPassword')]"
												},
												"windowsOperatingSystemProfile": null
											},
											"virtualNetworkProfile": null,
											"scriptActions": [],
											"dataDisksGroups": null
										}
									]
								},
								"minSupportedTlsVersion": "[parameters('minTlsVersionNumber')]",
								"encryptionInTransitProperties": {
									"isEncryptionInTransitEnabled": "[parameters('isEncryptionInTransitEnabled')]"
								}
							},
							"identity": {
								"type": "UserAssigned",
								"userAssignedIdentities": {
									"/subscriptions/<subcriptionID>/resourcegroups/<resourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<MSIname>": {}
								}
							}
						}
					]
				}
```


### Parameters

```json
     				{
				  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
				  "contentVersion": "1.0.0.0",
				  "parameters": {
					"clusterName": {
					  "value": "<clustername>"
					},
					"location": {
					  "value": "<region_name>"
					},
					"clusterVersion": {
					  "value": "5.1"
					},
					"clusterWorkerNodeCount": {
					  "value": 4
					},
					"clusterKind": {
					  "value": "SPARK"
					},
					"sshUserName": {
					  "value": "sshuser"
					},
					"clusterRestAuthEntraUsers": {
					  "value": "[{\"displayName\":\"<Name>\",\"objectId\":\"00000000-0000-0000-0000-1ed7871c38e0\",\"upn\":\"user2@contoso.com\"},{\"displayName\":\"<Name>\",\"objectId\":\"00000000-0000-0000-000-b44d6570aa30\",\"upn\":\"user1@contoso.com\"}]"
					},
					"sshPassword": {
					  "value": null
					},
					"minTlsVersionNumber": {
					  "value": "1.2"
					},
					"isEncryptionInTransitEnabled": {
					  "value": true
					}
				  }
				}
```

## Property Values

### Autoscale

| Name | Description | Value |
| --- | --- | --- |
| capacity | Parameters for load-based autoscale | AutoscaleCapacity |
| recurrence | Parameters for schedule-based autoscale | [AutoscaleRecurrence](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#autoscalerecurrence-1) |

### AutoscaleCapacity

| Name | Description | Value |
| --- | --- | --- |
| maxInstanceCount | Array of schedule-based autoscale rules | int |
| timeZone | The time zone for the autoscale schedule times | int |

### AutoscaleRecurrence

| Name | Description | Value |
| --- | --- | --- |
| schedule | Array of schedule-based autoscale rules | [AutoscaleSchedule](  /azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#autoscaleschedule-1) |
| timeZone | The time zone for the autoscale schedule times | string |

### AutoscaleSchedule

| Name | Description | Value |
| --- | --- | --- |
| days | Days of the week for a schedule-based autoscale rule | String array containing any of:'Friday' / 'Monday' / 'Saturday' / 'Sunday' / 'Thursday' / 'Tuesday' / 'Wednesday' |
| timeAndCapacity | Time and capacity for a schedule-based autoscale rule | [AutoscaleTimeAndCapacity](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#autoscaletimeandcapacity-1) |

### AutoscaleTimeAndCapacity

| Name | Description | Value |
| --- | --- | --- |
| maxInstanceCount | The maximum instance count of the cluster | int |
| minInstanceCount | The minimum instance count of the cluster | int |
| time | 24-hour time in the form HH:MM | string |


### ClusterCreatePropertiesOrClusterGetProperties

| Name | Description | Value |
| --- | --- | --- |
| clusterDefinition           | The cluster definition.                       | [ClusterDefinition](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#clusterdefinition-1)             |
| clusterVersion              | The version of the cluster.                   | string                        |
| computeIsolationProperties  | The compute isolation properties.             | [ComputeIsolationProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#computeisolationproperties-1)    |
| computeProfile              | The compute profile.                          | [ComputeProfile](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#computeprofile-1)                |
| diskEncryptionProperties    | The disk encryption properties.               | [DiskEncryptionProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#diskencryptionproperties-1)     |
| encryptionInTransitProperties | The encryption-in-transit properties.       | [EncryptionInTransitProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#encryptionintransitproperties-1) |
| kafkaRestProperties         | The cluster kafka rest proxy configuration.   | [KafkaRestProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#kafkarestproperties-1)           |
| minSupportedTlsVersion      | The minimal supported TLS version.            | string                        |
| networkProperties           | The network properties.                       | [NetworkProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#networkproperties-1)             |
| osType                      | The type of operating system.                 | 'Linux' / 'Windows'             |
| privateLinkConfigurations   | The private link configurations.              | [PrivateLinkConfiguration[]](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#networkproperties-1)    |
| securityProfile             | The security profile.                         | [SecurityProfile](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#securityprofile-1)               |
| storageProfile              | The storage profile.                          | [StorageProfile](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#storageprofile-1)                |
| tier                        | The cluster tier.                             | 'Premium' / 'Standard'          |


### ClusterDefinition

| Name | Description | Value |
| --- | --- | --- |
| blueprint          | The link to the blueprint.                           | string                          |
| componentVersion   | The versions of different services in the cluster.   | [ClusterDefinitionComponentVersion](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#clusterdefinitioncomponentversion-1) |
| configurations     | The cluster configurations.                          | any                             |
| kind               | The type of cluster.                                 | string                          |


### ClusterIdentity

| Name | Description | Value |
| --- | --- | --- |
| type | The type of identity used for the cluster. The type 'SystemAssigned, UserAssigned' includes both an implicitly created identity and a set of user assigned identities. | 'None' / 'SystemAssigned' / 'UserAssigned' |
| userAssignedIdentities | The list of user identities associated with the cluster. The user identity dictionary key references are ARM resource IDs in the form: '/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{identityName}'. | [ClusterIdentityUserAssignedIdentities](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#clusteridentityuserassignedidentities-1) |


### ComputeIsolationProperties

| Name | Description | Value |
| --- | --- | --- |
| enableComputeIsolation | The flag indicates whether enable compute isolation or not.  | bool |
| hostSku   | The host sku. | string  |

### ComputeProfile

| Name | Description | Value |
| --- | --- | --- |
| roles  | The list of roles in the cluster. | [Role](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#role-1) [] |

### DataDisksGroups

| Name | Description | Value |
| --- | --- | --- |
|disksPerNode	| The number of disks per node.	| int |


### DiskEncryptionProperties

| Name | Description | Value |
| --- | --- | --- |
| encryptionAlgorithm | Algorithm identifier for encryption, default RSA-OAEP. | 'RSA-OAEP' 'RSA-OAEP-256' 'RSA1_5' |
| encryptionAtHost    | Indicates whether or not resource disk encryption is enabled. | bool   |
| keyName             | Key name that is used for enabling disk encryption.          | string |
| keyVersion          | Specific key version that is used for enabling disk encryption. | string |
| msiResourceId       | Resource ID of Managed Identity that is used to access the key vault. | string |
| vaultUri            | Base key vault URI where the customer's key is located for example. https://myvault.vault.azure.net | string |


### EncryptionInTransitProperties

| Name | Description | Value |
| --- | --- | --- |
|isEncryptionInTransitEnabled |	Indicates whether or not inter cluster node communication is encrypted in transit.	| bool |


### Hardware Profile


| Name | Description | Value |
| --- | --- | --- |
| vmSize	| The size of the Virtual Machine	| string |


### IP Configuration


| Name | Description | Value |
| --- | --- | --- |
| name       | The name of private link IP configuration.        | string (required)        |
| properties | The private link ip configuration properties.     | IPConfigurationProperties |

### IPConfigurationProperties


| Name | Description | Value |
| --- | --- | --- |
| primary                  | Indicates whether this IP configuration is primary for the corresponding NIC. | bool        |
| privateIPAddress         | The IP address.                                                                | string      |
| privateIPAllocationMethod| The method that private IP address is allocated.                               | 'dynamic' 'static' |
| subnet                   | The subnet resource ID.                                                        | ResourceID  |

### IpTag


| Name | Description | Value |
| --- | --- | --- |
| ipTagType | Gets or sets the ipTag type: Example FirstPartyUsage.                  | string (required) |
| tag       | Gets or sets value of the IpTag associated with the public IP. Example HDInsight, SQL, Storage, etc., | string (required) |


### KafkaRestProperties

| Name | Description | Value |
| --- | --- | --- |
| clientGroupInfo       | The information of Microsoft Entra ID security group.              | ClientGroupInfo                          |
| configurationOverride | The configurations that need to be overridden.       | KafkaRestPropertiesConfigurationOverride |


### LinuxOperatingSystemProfile

| Name | Description | Value |
| --- | --- | --- |
| password   | The password.   | string     |
| sshProfile | The SSH profile.| [SshProfile](/azure/templates/microsoft.hdinsight/clusters#sshprofile-1) |
| username   | The username.   | string     |


### Microsoft.HDInsight/clusters

| Name | Description | Value |
| --- | --- | --- |
| apiVersion | The API version.                              | '2025-01-15-preview'                         |
| identity   | The identity of the cluster, if configured.   | ClusterIdentity                              |
| location   | The location of the cluster.                  | string                                      |
| name       | The resource name.                            | string (required)                           |
| properties | The clusters create parameters.                | [ClusterCreatePropertiesOrClusterGetProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#clustercreatepropertiesorclustergetproperties-1) |
| tags       | Resource tags. | Dictionary of tag names and values. See [Tags in templates](/azure/azure-resource-manager/management/tag-resources#arm-templates) |
| type       | The resource type.                            | 'Microsoft.HDInsight/clusters'              |
| zones      | The availability zones.                       | string[]                                    |


### NetworkProperties

| Name | Description | Value |
| --- | --- | --- |
| outboundDependenciesManagedType | A value to describe how the outbound dependencies of a HDInsight cluster are managed. 'Managed' means the HDInsight service manages the outbound dependencies. 'External' means a customer-specific solution manages the outbound dependencies. | 'External' 'Managed' |
| privateLink                     | Indicates whether or not private link is enabled.                                                                                                                                    | 'Disabled' 'Enabled' |
| publicIpTag                     | Gets or sets the IP tag for the public IPs created along with the HDInsight Clusters.                                                                                                 | IpTag                |
| resourceProviderConnection      | The direction for the resource provider connection.                                                                                                                                  | 'Inbound' 'Outbound' |



### OsProfile

| Name | Description | Value |
| --- | --- | --- |
| linuxOperatingSystemProfile |	The Linux OS profile.	| LinuxOperatingSystemProfile |



### PrivateLinkConfiguration

| Name | Description | Value |
| --- | --- | --- |
| name       | The name of private link configuration.      | string (required)                     |
| properties | The private link configuration properties.   | [PrivateLinkConfigurationProperties](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#privatelinkconfigurationproperties-1) (required) |


### PrivateLinkConfigurationProperties

| Name | Description | Value |
| --- | --- | --- |
| groupID          | The HDInsight private linkable subresource name to apply the private link configuration to. For example, 'headnode'/ 'gateway'/ 'edgenode'. | string (required)   |
| ipConfigurations | The IP configurations for the private link service.                                                                                           | IPConfiguration[] (required) |


### ResourceID

| Name | Description | Value |
| --- | --- | --- |
| ID	| The Azure resource ID.	| string |

### Role

| Name | Description | Value |
| --- | --- | --- |
| autoscale             | The autoscale configurations.              | {Autoscale}(/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#autoscale-1)            |
| dataDisksGroups       | The data disks groups for the role.        | [DataDisksGroups](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#datadisksgroups-1) []   |
| encryptDataDisks      | Indicates whether encrypt the data disks.  | bool                 |
| hardwareProfile       | The hardware profile.                      | [HardwareProfile](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#hardwareprofile-1)      |
| minInstanceCount      | The minimum instance count of the cluster. | int                  |
| name                  | The name of the role.                      | string               |
| osProfile             | The operating system profile.              | [OsProfile](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#osprofile-1)           |
| scriptActions         | The list of script actions on the role.    | [ScriptAction](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#scriptaction-1)[]       |
| targetInstanceCount   | The instance count of the cluster.         | int                  |
| virtualNetworkProfile | The virtual network profile.               | [VirtualNetworkProfile](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#virtualnetworkprofile-1)|
| VMGroupName           | The name of the virtual machine group.     | string               |


### ScriptAction

| Name | Description | Value |
| --- | --- | --- |
| name       | The name of the script action.          | string (required) |
| parameters | The parameters for the script provided. | string (required) |
| uri        | The URI to the script.                  | string (required) |



### StorageAccount

| Name | Description | Value |
| --- | --- | --- |
| container      | The container in the storage account, only to be specified for `WASB` storage accounts. | string |
| enableSecureChannel | Enable secure channel or not, it's an optional field. Default value is false when cluster version < 5.1 and true when cluster version >= 5.1. | bool |
| fileshare      | The file share name.                                                                  | string |
| fileSystem     | The filesystem, only to be specified for Azure Data Lake Storage Gen 2.                | string |
| isDefault      | Whether or not the storage account is the default storage account.                     | bool   |
| key            | The storage account access key.                                                        | string |
| msiResourceId  | The managed identity (MSI) that is allowed to access the storage account, only to be specified for Azure Data Lake Storage Gen 2. | string |
| name           | The name of the storage account.                                                       | string |
| resourceId     | The resource ID of storage account, only to be specified for Azure Data Lake Storage Gen 2. | string |
| saskey         | The shared access signature key.                                                       | string |


### StorageProfile

| Name | Description | Value |
| --- | --- | --- |
| storage accounts |	The list of storage accounts in the cluster.	| [StorageAccount](/azure/templates/microsoft.hdinsight/clusters?pivots=deployment-language-arm-template#storageaccount-1)[]


### UserAssignedIdentity

| Name | Description | Value |
| --- | --- | --- |
| tenantID	| The tenant ID of user assigned identity.	| string |



### VirtualNetworkProfile

| Name | Description | Value |
| --- | --- | --- |
| ID	| The ID of the virtual network.	| string |
| subnet	| The name of the subnet.	| string |




By managing Microsoft Entra ID-enabled Azure HDInsight clusters with ARM templates, you gain a consistent, repeatable, and automated way to deploy and configure secure big data environments. ARM templates allow you to define all cluster settings including identity, networking, storage, and security as code, ensuring that deployments are predictable and compliant with organizational standards.

This approach not only streamlines cluster provisioning and management but also integrates seamlessly with CI/CD pipelines, enabling you to scale and govern your HDInsight workloads with confidence.


