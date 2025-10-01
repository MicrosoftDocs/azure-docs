---
title: Manage Entra ID enabled Azure HDInsight clusters using REST API
description: Learn how to manage Entra ID enabled Azure HDInsight clusters using REST API
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 08/21/2025
---

# Manage Entra ID enabled HDInsight clusters using REST API

Microsoft Entra ID enabled HDInsight clusters can be administered programmatically through the Azure REST API. The REST API allows authorized clients to perform management operations such as provisioning, updating, scaling, and deleting clusters. This method is well-suited for enterprise automation scenarios, integration with CI/CD pipelines, and environments requiring precise control without reliance on the Azure portal or SDK.



## Create

Creates an Entra enabled cluster in the specified subscription.


## Request

See [Common parameters and headers](/rest/api/hdinsight/#common-parameters-and-headers) for headers and parameters that are used by clusters.


| Method | Request URI |
| --- | --- |
| PUT | https://management.azure.com/subscriptions/{subscription Id}/resourceGroups/{resourceGroup Name}/providers/Microsoft.HDInsight/clusters/{cluster name}?api-version={api-version} |
 
 
 The following example shows the request body for creating an Entra enabled Linux-based hadoop cluster. For examples of creating clusters in other ways, see the Examples section as follows:




  ```json

    		{
			"id":"/subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.HDInsight/clusters/mycluster",
		  "name":"mycluster",
		  "type":"Microsoft.HDInsight/clusters",

			"location": "location-name",
			"tags": { "tag1": "value1", "tag2": "value2" },
			"properties": {
				"clusterVersion": "5.1",
				"osType": "Linux",
				"provisioningState": "InProgress",
				"clusterState": "Accepted",
				"createdDate": "2015-09-23",
				"quotaInfo": {
					"coresUsed": 20
		}
				"clusterDefinition": {
					"kind": "hadoop"
				},

				"computeProfile": {
					"roles": [
						{
							"name": "headnode",

							"targetInstanceCount": 2,

							"hardwareProfile": {
								"vmSize": "Large"
							}

						},
						{
							"name": "workernode",

							"targetInstanceCount": 1,

							"hardwareProfile": {
								"vmSize": "Large"
							}
						},
						{
							"name": "zookeepernode",

							"targetInstanceCount": 3,

							"hardwareProfile": {
								"vmSize": "Small"
							}
						}
					]
				}
			}
		}
  ```









| Element name | Required | Type | Description |
| --- | --- | --- | --- |
| ID           | Yes      | String       | Specifies the resource identifier of the cluster. |
| name         | Yes      | String       | Specifies the name of the cluster. |
| type         | Yes      | String       | Specifies the type of the cluster. |
| location     | Yes      | String       | Specifies the supported Azure location where the cluster should be created. For more information, see [List all of the available geo-locations](/azure/azure-resource-manager/management/azure-subscription-service-limits#regions). |
| tags         | No       | String       | Specifies the tags that will be assigned to the cluster. For more information about using tags, see [Using tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources). |
| properties   | Yes      | Complex Type | Specifies the properties of the cluster. |





## Properties

| Element name | Required | Type | Description |
| --- | --- | --- | --- |
| clusterVersion    | Yes      | String       | Specifies the cluster version.                                              |
| osType            | Yes      | String       | Specifies the Operating system for the cluster. Valid values are Linux and Windows. |
| clusterDefinition | Yes      | Complex Type | Specifies information about the cluster type and configurations.            |
| computeProfile    | Yes      | Complex Type | Specifies information about the cluster topology and associated role properties. |




### clusterDefinition

| Element name | Required | Type | Description |
| --- | --- | --- | --- |
| Element name   | Required | Type       | Description |
| kind           | Yes      | String     | Specifies the cluster type. Valid values are hadoop, hbase, storm, and spark. |
| configurations | Yes      | Dictionary | A dictionary of configuration type and its associated value dictionary. **gateway** configuration type is used to configure the HTTP user for connecting to web APIs and the Ambari portal. **core-site** configuration type is used to configure the default storage account for the cluster. |




### computeProfile


| Element name   | Required | Type                              | Description |
|----------------|----------|-----------------------------------|-------------|
| clusterVersion | Yes      | String                            | Specifies the cluster version. |
| role           | Yes      | Array of Complex Type (role)      | Specifies information about roles in the cluster. |





### role


| Element name        | Required | Type          | Description |
|---------------------|----------|---------------|-------------|
| name                | Yes      | String        | Specifies the role name. |
| targetInstanceCount | Yes      | Integer       | Specifies the target instance count for the role. |
| hardwareProfile     | Yes      | Complex Type  | Specifies information about the hardware profile for the role. |
| osProfile           | Yes      | Complex Type  | Specifies information about the OS profile for the role. |




### hardwareProfile


| Element name | Required | Type   | Description |
|--------------|----------|--------|-------------|
| vmSize       | Yes      | String | Specifies the size of the Virtual Machine. Refer to [HDInsight configuration options](/azure/hdinsight/hdinsight-component-versioning#node-pricing-tiers) (scroll down to **Node pricing tiers**) for valid sizes. |




### osProfile


| Element name                 | Required | Type                   | Description |
|------------------------------|----------|------------------------|-------------|
| linuxOperatingSystemProfile  | No       | Complex Type           | Specifies the Linux OS-related settings. |
| windowsOperatingSystemProfile| No       | Complex Type           | Specifies the Windows OS-related settings. |
| virtualNetworkProfile        | No       | Complex Type           | Specifies virtual network-related settings if the cluster is being deployed in a virtual network in the user’s subscription. |
| scriptActions                | No       | Array of Complex Type  | List of script actions to execute on the cluster. |



### linuxOperatingSystemProfile


| Element name | Required | Type         | Description |
|--------------|----------|--------------|-------------|
| Username     | Yes      | String       | SSH user name. |
| sshProfile   | No       | Complex Type | Specifies the SSH key. One of sshProfile or Password is required. |
| Password     | No       | String       | Specifies the SSH password. One of sshProfile or Password is required. |




### sshProfile


| Element name | Required | Type | Description |
|--------------|----------|------|-------------|
| publicKeys   | Yes      | Array | Contains a list of certificateData objects. The value is an ssh-rsa public key. |




### windowsOperatingSystemProfile


| Element name | Required | Type | Description |
|--------------|----------|------|-------------|
| rdpSettings  | No       | Complex Type | Specifies RDP settings for Windows clusters. |



### rdpSettings


| Element name | Required | Type  | Description |
|--------------|----------|-------|-------------|
| username     | Yes      | String | Specifies the RDP user name. |
| password     | Yes      | String | Specifies the password for the RDP user. |
| expiryDate   | Yes      | Date   | Expiry date for the RDP credentials. |



### virtualNetworkProfile


| Element name | Required | Type   | Description |
|--------------|----------|--------|-------------|
| ID           | Yes      | String | Virtual Network Resource ID. |
| subnet       | Yes      | String | Specifies the subnet name. |



### scriptActions


| Element name | Required | Type   | Description |
|--------------|----------|--------|-------------|
| name         | Yes      | String | Friendly name for the script action. |
| uri          | Yes      | String | URL to the script action file. |
| parameters   | No       | String | Arguments to pass when executing the script action file. |




## Response


If validation is complete and the request is accepted, the operation returns 200 (OK).

**Status code:** 200 OK

## Response body for a linux cluster created using ssh key:

```json
		{
		"id": "/subscriptions/{ subscription-id }/resourceGroups/myresourcegroup1/providers/Microsoft.HDInsight/ clusters/mycluster ",
		"name": "mycluster",
		"type": "Microsoft.HDInsight/clusters",
		"location": "location-name",
		"tags": {
			"tag1": "value1",
			"tag2": "value2"
		},
		"properties": {
			"clusterVersion": "5.1",
			"osType": "Linux",
			"tier": "premium",
			"clusterDefinition": {
				"kind": "hadoop",
				"configurations": {
					"gateway": {
						 "restAuthEntraUsers": "[{\"objectID\":\"000000-00000-00000-000000\",\"displayName\":\"User1\",\"upn\":\"user1@contoso.com\"},{\"objectId\":\"000000-00000-00000-00001\",\"displayName\":\"User 2\",\"upn\":\"user2@contoso.com\"}]"
					},
					"core-site": {
						"fs.defaultFS": "wasb://container@storageaccount.blob.core.windows.net",
						"fs.azure.account.key.storageaccount.blob.core.windows.net": "storage-account-key"
					}
				}
			},
			"securityProfile": {
				"directoryType": "ActiveDirectory",
				"domain": "mydomain.com",
				"organizationalUnitDN": "OU=Hadoop,DC=mydomain,DC=COM",
				"ldapsUrls": ["ldaps://mydomain.com:636"],
				"domainUsername": "clusteradmin@mydomain.com",
				"domainUserPassword": "password",
				"clusterUsersGroupDNs": ["ADGroup1", "ADGroup2"]
			},
			"computeProfile": {
				"roles": [
					{
						"name": "headnode",
						"targetInstanceCount": 2,
						"hardwareProfile": {
							"vmSize": "Large"
						},
						"osProfile": {
							"linuxOperatingSystemProfile": {
								"username": "username",
								"sshProfile": {
									"publicKeys": [
										{
											"certificateData": "ssh-rsa key"
										}
									]
								}
							}
						},
						"virtualNetworkProfile": {
							"id": "/subscriptions/mysubscriptionid/resourceGroups/myrresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork",
							"subnet": "/subscriptions/mysubscriptionid /resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet"
						}
					},
					{
						"name": "workernode",
						"targetInstanceCount": 1,
						"hardwareProfile": {
							"vmSize": "Large"
						},
						"osProfile": {
							"linuxOperatingSystemProfile": {
								"username": "username",
								"sshProfile": {
									"publicKeys": [
										{
											"certificateData": " ssh-rsa key"
										}
									]
								}
							}
						},
						"virtualNetworkProfile": {
							"id": "/subscriptions/mysubscriptionid/resourceGroups/myrresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork",
							"subnet": "/subscriptions/mysubscriptionid /resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet"
						}
					},
					{
						"name": "zookeepernode",
						"targetInstanceCount": 3,
						"hardwareProfile": {
							"vmSize": "Small"
						},
						"osProfile": {
							"linuxOperatingSystemProfile": {
								"username": "username",
								"sshProfile": {
									"publicKeys": [
										{
											"certificateData": "ssh-rsa key"
										}
									]
								}
							},
							"virtualNetworkProfile": {
								"id": "/subscriptions/mysubscriptionid/resourceGroups/myrresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork",
								"subnet": "/subscriptions/mysubscriptionid /resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet"
							}
						}
					}
				]
			}
		}
	}

```



| Element name         | Type                   | Description|
|-----------------------|------------------------|--------------------------------------------------------------------------|
| provisioningState    | String                 | Indicates the current provisioning state.                                 |
| clusterState         | String                 | Indicates the more detailed HDInsight cluster state while provisioning is in progress. |
| createdDate          | Date                   | Datetime when the cluster create request was received.                    |
| quotaInfo            | Complex Type           | Specifies the cores used by the cluster.                                  |
| errors               | Array of error messages| Contains the error message if provisioningState = ‘failed’.               |
| connectivityEndpoints| Complex Type           | Specifies the public endpoints for the cluster.                           |



### connectivityEndpoints

| Element name | Type   | Description                                               |
|--------------|--------|-----------------------------------------------------------|
| name         | String | Friendly name for the connectivity endpoint.              |
| protocol     | String | Specifies the protocol to use (example: HTTPS, SSH).      |
| location     | String | Specifies the URL to connect.                             |
| port         | Int    | Specifies the port to connect.                            |





### Create a premium, domain-joined HDInsight cluster (Linux only)

Create a premium domain-joined cluster with Apache Ranger. User needs to provide SecurityProfile in the request body to create a secure cluster.


### Request

See [Common parameters and headers](/rest/api/hdinsight/#common-parameters-and-headers) for headers and parameters that are used by clusters.


| Method | Request URI                                                                                                                                                                        |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PUT    | `https://management.azure.com/subscriptions/{subscription ID}/resourceGroups/{resourceGroup Name}/providers/Microsoft.HDInsight/clusters/{cluster name}?api-version={api-version}` |




The following example shows the request body for creating an Entra enabled Linux based, premium, domain-joined Hadoop cluster.

```json
	{
	"id": "/subscriptions/{ subscription-id }/resourceGroups/myresourcegroup1/providers/Microsoft.HDInsight/ clusters/mycluster ", "
	name "
	: "mycluster",
	"type": "Microsoft.HDInsight/clusters",
	"location": "location-name",
	"tags": {
		"tag1": "value1",
		"tag2": "value2"
	},
	"properties": {
		"clusterVersion": "5.1",
		"osType": "Linux",
		"tier": "premium",
		"clusterDefinition": {
			"kind": "hadoop",
			"configurations": {
				"gateway": {
                     "restAuthEntraUsers": "[{\"objectId\":\"000000-00000-00000-000000\",\"displayName\":\"User1\",\"upn\":\"user1@contoso.com\"},{\"objectId\":\"000000-00000-00000-00001\",\"displayName\":\"User 2\",\"upn\":\"user2@contoso.com\"}]"
                },
				"core-site": {
					"fs.defaultFS": "wasb://container@storageaccount.blob.core.windows.net",
					"fs.azure.account.key.storageaccount.blob.core.windows.net": "storage-account-key"
				}
			}
		},
		"securityProfile": {
			"directoryType": "ActiveDirectory",
			"domain": "mydomain.com",
			"organizationalUnitDN": "OU=Hadoop,DC=mydomain,DC=COM",
			"ldapsUrls": ["ldaps://mydomain.com:636"],
			"domainUsername": "clusteradmin@mydomain.com",
			"domainUserPassword": "password",
			"clusterUsersGroupDNs": ["ADGroup1", "ADGroup2"]
		},
		"computeProfile": {
			"roles": [
				{
					"name": "headnode",
					"targetInstanceCount": 2,
					"hardwareProfile": {
						"vmSize": "Large"
					},
					"osProfile": {
						"linuxOperatingSystemProfile": {
							"username": "username",
							"sshProfile": {
								"publicKeys": [
									{
										"certificateData": "ssh-rsa key"
									}
								]
							}
						}
					},
					"virtualNetworkProfile": {
						"id": "/subscriptions/mysubscriptionid/resourceGroups/myrresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork",
						"subnet": "/subscriptions/mysubscriptionid /resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet"
					}
				},
				{
					"name": "workernode",
					"targetInstanceCount": 1,
					"hardwareProfile": {
						"vmSize": "Large"
					},
					"osProfile": {
						"linuxOperatingSystemProfile": {
							"username": "username",
							"sshProfile": {
								"publicKeys": [
									{
										"certificateData": " ssh-rsa key"
									}
								]
							}
						}
					},
					"virtualNetworkProfile": {
						"id": "/subscriptions/mysubscriptionid/resourceGroups/myrresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork",
						"subnet": "/subscriptions/mysubscriptionid /resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet"
					}
				},
				{
					"name": "zookeepernode",
					"targetInstanceCount": 3,
					"hardwareProfile": {
						"vmSize": "Small"
					},
					"osProfile": {
						"linuxOperatingSystemProfile": {
							"username": "username",
							"sshProfile": {
								"publicKeys": [
									{
										"certificateData": "ssh-rsa key"
									}
								]
							}
						},
						"virtualNetworkProfile": {
							"id": "/subscriptions/mysubscriptionid/resourceGroups/myrresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork",
							"subnet": "/subscriptions/mysubscriptionid /resourceGroups/myresourcegroup/providers/Microsoft.Network/virtualNetworks/myvirtualnetwork/subnets/mysubnet"
						}
					}
				}
			]
		}
	}
}
```





| Element name | Required | Type | Description |
|--------------|----------|------|-------------|
| ID | Yes | String | Specifies the resource identifier of the cluster. |
| name | Yes | String | Specifies the name of the cluster. |
| type | Yes | String | Specifies the type of the cluster. |
| location | Yes | String | Specifies the supported Azure location where the cluster should be created. For more information, see [List all of the available geo-locations](/azure/azure-resource-manager/management/azure-subscription-service-limits#regions). |
| tags | No | String | Specifies the tags that will be assigned to the cluster. For more information about using tags, see [Using tags to organize your Azure resources](/azure/azure-resource-manager/management/tag-resources). |
| Properties | Yes | Complex Type | Specifies the properties of the cluster. |




### Properties


| Element name      | Required | Type         | Description |
|------------------|----------|--------------|-------------|
| clusterVersion    | Yes      | String       | Specifies the cluster version. |
| osType            | Yes      | String       | Specifies the Operating system for the cluster. Valid value is Linux because only Linux cluster types can join an Azure AD domain. |
| tier              | No       | String       | Default value is standard. Valid values are standard and premium. If no value is specified, the value is assumed to be standard. Specifies the Tier for the cluster. Domain joined clusters are only supported in premium tier. |
| clusterDefinition | Yes      | Complex Type | Specifies information about the cluster type and configurations. |
| computeProfile    | Yes      | Complex Type | Specifies information about the cluster topology and associated role properties. |
| securityProfile   | No       | Complex Type | If a secure, domain-joined cluster is being created, this element specifies the Active Directory related settings. |




### clusterDefinition



| Element name    | Required | Type       | Description |
|-----------------|----------|------------|-------------|
| kind            | Yes      | String     | Specifies the cluster type. Valid values are hadoop, hbase, storm, and spark. |
| configurations  | Yes      | Dictionary | This element is a dictionary of configuration type and its associated value dictionary. **gateway** configuration type is used to configure the HTTP user for connecting to web APIs and the Ambari portal. **core-site** configuration type is used to configure the default storage account for the cluster. |




### computeProfile


| Element name   | Required | Type                       | Description |
|----------------|----------|----------------------------|-------------|
| clusterVersion | Yes      | String                     | Specifies the cluster version. |
| role           | Yes      | Array of Complex Type (role) | Specifies information about roles in the cluster. |



### securityProfile


| Element name            | Required | Type             | Description |
|-------------------------|----------|-----------------|-------------|
| directoryType           | Yes      | String          | Type of LDAP directory that is used. Currently "ActiveDirectory" is the only supported value. |
| domain                  | Yes      | String          | Active Directory domain for the cluster. |
| organizationalUnitDN    | Yes      | String          | Distinguished name of the organizational unit in the Active Directory where user and computer accounts are created. |
| ldapsUrls               | Yes      | Array of String | URLs of one or multiple LDAPS servers for the Active Directory. |
| domainUserName          | Yes      | String          | A domain user account with sufficient permissions for creating the cluster. It should be in user@domain format. |
| domainUserPassword      | Yes      | String          | Password for the domain user account. |
| clusterUsersGroupDNS    | No       | Array of String | Distinguished names of the Active Directory groups that will be available in Ambari and Apache Ranger. |





### role


| Element name        | Required | Type         | Description |
|---------------------|----------|--------------|-------------|
| name                | Yes      | String       | Specifies the role name. |
| targetInstanceCount | Yes      | Integer      | Specifies the target instance count for the role. |
| hardwareProfile     | Yes      | Complex Type | Specifies information about the hardware profile for the role. |
| osProfile           | Yes      | Complex Type | Specifies information about the OS profile for the role. |




### hardwareProfile


| Element name | Required | Type   | Description |
|--------------|----------|--------|-------------|
| vmSize       | Yes      | String | Specifies the size of the VM. Refer to [HDInsight configuration options](/azure/hdinsight/hdinsight-component-versioning#node-pricing-tiers) (scroll down to **Node pricing tiers**) for valid sizes. |



### osProfile


| Element name                 | Required | Type                   | Description |
|-------------------------------|----------|------------------------|-------------|
| linuxOperatingSystemProfile  | No       | Complex Type           | Specifies the Linux OS-related settings. |
| virtualNetworkProfile        | No       | Complex Type           | Specifies virtual network-related settings if the cluster is being deployed in a virtual network in the user’s subscription. |
| scriptActions                | No       | Array of Complex Type  | List of script actions to execute on the cluster. |



### linuxOperatingSystemProfile


| Element name | Required | Type         | Description |
|--------------|----------|--------------|-------------|
| Username     | Yes      | String       | SSH user name. |
| sshProfile   | No       | Complex Type | Specifies the SSH key. One of sshProfile or Password is required. |
| Password     | No       | String       | Specifies the SSH password. One of sshProfile or Password is required. |




### sshProfile


| Element name | Required | Type  | Description |
|--------------|----------|-------|-------------|
| publicKeys   | Yes      | Array | Contains a list of certificateData objects. The value is an ssh-rsa public key. |




### virtualNetworkProfile


| Element name | Required | Type   | Description |
|--------------|----------|--------|-------------|
| ID           | Yes      | String | Virtual Network Resource ID. |
| subnet       | Yes      | String | Specifies the subnet name. |




### scriptActions


| Element name | Required | Type   | Description |
|--------------|----------|--------|-------------|
| name         | Yes      | String | Friendly name for the script action. |
| uri          | Yes      | String | URL to the script action file. |
| parameters   | No       | String | Arguments to pass when executing the script action file. |




### Response

If validation is complete and the request is accepted, the operation returns 200 (OK).


### Status code: 200 OK


## Response body for a linux cluster creates using ssh key:


```json
 		{
			"id":"/subscriptions/{subscription-id}/resourceGroups/myresourcegroup1/providers/Microsoft.HDInsight/clusters/mycluster",
		  "name":"mycluster",
		  "type":"Microsoft.HDInsight/clusters",

			"location": "location-name",
			"tags": { "tag1": "value1", "tag2": "value2" },
			"properties": {
				"clusterVersion": "5.1",
				"osType": "Linux",
				"provisioningState": "InProgress",
				"clusterState": "Accepted",
				"createdDate": "2015-09-23",
				"quotaInfo": {
					"coresUsed": 20
		}
				"clusterDefinition": {
					"kind": "hadoop"
				},

				"computeProfile": {
					"roles": [
						{
							"name": "headnode",

							"targetInstanceCount": 2,

							"hardwareProfile": {
								"vmSize": "Large"
							}

						},
						{
							"name": "workernode",

							"targetInstanceCount": 1,

							"hardwareProfile": {
								"vmSize": "Large"
							}
						},
						{
							"name": "zookeepernode",

							"targetInstanceCount": 3,

							"hardwareProfile": {
								"vmSize": "Small"
							}
						}
					]
				}
			}
		}

```



| Element name          | Type                   | Description |
|-----------------------|------------------------|-------------|
| provisioningState     | String                 | Indicates the current provisioning state. |
| clusterState          | String                 | Indicates the more detailed HDInsight cluster state while provisioning is in progress. |
| createdDate           | Date                   | Datetime when the cluster create request was received. |
| quotaInfo             | Complex Type           | Specifies the cores used by the cluster. |
| errors                | Array of error messages| Contains the error message if provisioningState = ‘failed’. |
| connectivityEndpoints | Complex Type           | Specifies the public endpoints for the cluster. |



### connectivityEndpoints


| Element name | Type   | Description |
|--------------|--------|-------------|
| name         | String | Friendly name for the connectivity endpoint. |
| protocol     | String | Specifies the protocol to use (example: HTTPS, SSH). |
| location     | String | Specifies the URL to connect. |
| port         | Int    | Specifies the port to connect. |



## Create a cluster with Azure Data Lake Store as the default filesystem


Creates a cluster in the specified subscription with Azure Data Lake Store as the default filesystem. Provide a **ClusterIdentity** object in the request body and configure the **default-filesystem** property with appropriate Data Lake Store URL.

Azure Data Lake can be configured as the default filesystem for cluster versions starting from 5.1 inclusive.

### Request


See [Common parameters](/rest/api/hdinsight/#common-parameters-and-headers) and headers for headers and parameters that are used by clusters.


This example shows the request body for creating a Linux-based Hadoop cluster using Azure Data Lake Store as the default filesystem for the cluster.


| Method | Request URI |
|--------|-------------|
| PUT    | `https://management.azure.com/subscriptions/{subscription Id}/resourceGroups/{resourceGroup Name}/providers/Microsoft.HDInsight/clusters/{cluster name}?api-version={api-version}` |

