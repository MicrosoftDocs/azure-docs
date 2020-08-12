---
title: Azure virtual machine image validation - Azure Marketplace
description: Learn how to test and submit a virtual machine offer in the commercial marketplace.
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: article
author: iqshahmicrosoft
ms.author: iqshah 
ms.date: 08/14/2020
---

# Azure virtual machine image validation

This article describes how to test and submit a virtual machine (VM) image in the commercial marketplace to ensure it meets the latest Azure Marketplace publishing requirements.

Complete these steps before submitting your VM offer:

- Deploy an Azure VM using your generalized image.
- Run validations.

## Deploy an Azure VM using your generalized image

This section describes how to deploy a generalized virtual hard disk (VHD) image to create a new Azure VM resource. For this process, we’ll use the supplied Azure Resource Manager template and Azure PowerShell script.

### Prepare an Azure Resource Manager template

This section describes how to create and deploy a user-provided virtual machine (VM) image. You can do this by providing operating system and data disk VHD images from an Azure-deployed virtual hard disk. These steps deploy the VM using generalized VHD.

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Upload your generalized operating system VHD and data disk VHDs to your Azure Storage account.
3. On the home page, select **Create a resource**, search for “Template Deployment”, and select **Create**.
4. Choose **Build your own template in the editor**.

    :::image type="content" source="media/vm/template-deployment.png" alt-text="Shows the selection of a template.":::

5. Paste the following JSON template into the editor and select **Save**.
6. Provide the parameter values for the displayed Custom deployment property pages.

#### For generation 1 VM deployment, use this template: <font color="red">added this heading</font>

```JSON
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "userStorageAccountName": {
            "type": "String"
        },
        "userStorageContainerName": {
            "defaultValue": "vhds",
            "type": "String"
        },
        "dnsNameForPublicIP": {
            "type": "String"
        },
        "adminUserName": {
            "defaultValue": "isv",
            "type": "String"
        },
        "adminPassword": {
            "defaultValue": "",
            "type": "SecureString"
        },
        "osType": {
            "defaultValue": "windows",
            "allowedValues": [
                "windows",
                "linux"
            ],
            "type": "String"
        },
        "subscriptionId": {
            "type": "String"
        },
        "location": {
            "type": "String"
        },
        "vmSize": {
            "type": "String"
        },
        "publicIPAddressName": {
            "type": "String"
        },
        "vmName": {
            "type": "String"
        },
        "virtualNetworkName": {
            "type": "String"
        },
        "nicName": {
            "type": "String"
        },
        "vhdUrl": {
            "type": "String",
            "metadata": {
                "description": "VHD Url..."
            }
        }
    },
    "variables": {
        "addressPrefix": "10.0.0.0/16",
        "subnet1Name": "Subnet-1",
        "subnet2Name": "Subnet-2",
        "subnet1Prefix": "10.0.0.0/24",
        "subnet2Prefix": "10.0.1.0/24",
        "publicIPAddressType": "Dynamic",
        "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',parameters('virtualNetworkName'))]",
        "subnet1Ref": "[concat(variables('vnetID'),'/subnets/',variables('subnet1Name'))]",
        "hostDNSNameScriptArgument": "[concat(parameters('dnsNameForPublicIP'),'.',parameters('location'),'.cloudapp.azure.com')]",
        "osDiskVhdName": "[concat('http://',parameters('userStorageAccountName'),'.blob.core.windows.net/',parameters('userStorageContainerName'),'/',parameters('vmName'),'osDisk.vhd')]"
    },
    "resources": [
        {
            "type": "Microsoft.Network/publicIPAddresses",
            "apiVersion": "2015-06-15",
            "name": "[parameters('publicIPAddressName')]",
            "location": "[parameters('location')]",
            "properties": {
                "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
                "dnsSettings": {
                    "domainNameLabel": "[parameters('dnsNameForPublicIP')]"
                }
            }
        },
        {
            "type": "Microsoft.Network/virtualNetworks",
            "apiVersion": "2015-06-15",
            "name": "[parameters('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "[variables('addressPrefix')]"
                    ]
                },
                "subnets": [
                    {
                        "name": "[variables('subnet1Name')]",
                        "properties": {
                            "addressPrefix": "[variables('subnet1Prefix')]"
                        }
                    },
                    {
                        "name": "[variables('subnet2Name')]",
                        "properties": {
                            "addressPrefix": "[variables('subnet2Prefix')]"
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Network/networkInterfaces",
            "apiVersion": "2015-06-15",
            "name": "[parameters('nicName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]",
                "[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]"
            ],
            "properties": {
                "ipConfigurations": [
                    {
                        "name": "ipconfig1",
                        "properties": {
                            "privateIPAllocationMethod": "Dynamic",
                            "publicIPAddress": {
                                "id": "[resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName'))]"
                            },
                            "subnet": {
                                "id": "[variables('subnet1Ref')]"
                            }
                        }
                    }
                ]
            }
        },
        {
            "type": "Microsoft.Compute/virtualMachines",
            "apiVersion": "2015-06-15",
            "name": "[parameters('vmName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Network/networkInterfaces/', parameters('nicName'))]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[parameters('vmSize')]"
                },
                "osProfile": {
                    "computername": "[parameters('vmName')]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": {
                    "osDisk": {
                        "name": "[concat(parameters('vmName'),'-osDisk')]",
                        "osType": "[parameters('osType')]",
                        "caching": "ReadWrite",
                        "image": {
                            "uri": "[parameters('vhdUrl')]"
                        },
                        "vhd": {
                            "uri": "[variables('osDiskVhdName')]"
                        },
                        "createOption": "FromImage"
                    }
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces',parameters('nicName'))]"
                        }
                    ]
                }
            }
        },
        {
            "type": "Microsoft.Compute/virtualMachines/extensions",
            "apiVersion": "2015-06-15",
            "name": "[concat(parameters('vmName'),'/WinRMCustomScriptExtension')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Compute/virtualMachines/', parameters('vmName'))]"
            ],
            "properties": {
                "publisher": "Microsoft.Compute",
                "type": "CustomScriptExtension",
                "typeHandlerVersion": "1.4",
                "settings": {
                    "fileUris": [
                        "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-winrm-windows/ConfigureWinRM.ps1",
                        "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-winrm-windows/makecert.exe",
                        "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vm-winrm-windows/winrmconf.cmd"
                    ],
                    "commandToExecute": "[concat('powershell -ExecutionPolicy Unrestricted -file ConfigureWinRM.ps1 ',variables('hostDNSNameScriptArgument'))]"
                }
            }
        }
    ]
}
```

<br><font color="red">if this table applies to the next JSON code too, it should probably be moved after it</font>

| ResourceGroupName | Existing Azure resource group name. Typically, use the same RG as your key vault. |
| --- | --- |
| TemplateFile | Full pathname to the file VHDtoImage.json. |
| userStorageAccountName | Name of the storage account. |
| dnsNameForPublicIP | DNS name for the public IP; must be lowercase. |
| subscriptionId | Azure subscription identifier. |
| Location | Standard Azure geographic location of the resource group. |
| vmName | Name of the virtual machine. |
| vhdUrl | Web address of the virtual hard disk. |
| vmSize | Size of the virtual machine instance. |
| publicIPAddressName | Name of the public IP address. |
| virtualNetworkName | Name of the virtual network. |
| nicName | Name of the network interface card for the virtual network. |
| adminUserName | Username of the administrator account. |
| adminPassword | Administrator password. |
|

7. After you supply these values, select **Purchase**.

Azure will begin deployment. It creates a new VM with the specified unmanaged VHD in the specified storage account path. You can track the progress in the Azure portal by selecting **Virtual Machines** on the left side of the portal. When the VM is created, the status will change from Starting to Running.

#### For generation 2 VM deployment, use this template:

```JSON
{  
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
  "parameters": {
    "userStorageAccountName": {
      "type": "String"
    },
    "userStorageContainerName": {
      "type": "String",
      "defaultValue": "vhds-86350-720-f4efbbb2-611b-4cd7-ad1e-afdgfuadfluad"
    },
    "dnsNameForPublicIP": {
      "type": "String"
    },
    "adminUserName": {
      "defaultValue": "isv",
      "type": "String"
    },
    "adminPassword": {
      "type": "securestring",
      "defaultValue": "Certcare@86350"
    },
    "osType": {
      "type": "string",
      "defaultValue": "linux",
      "allowedValues": [
        "windows",
        "linux"
      ]
    },
    "subscriptionId": {
      "type": "string"
    },
    "location": {
      "type": "string"
    },
    "vmSize": {
      "type": "string"
    },
    "publicIPAddressName": {
      "type": "string"
    },
    "vmName": {
      "type": "string"
    },
    "vNetNewOrExisting": {
      "defaultValue": "existing",
      "allowedValues": [
        "new",
        "existing"
      ],
      "type": "String",
      "metadata": {
        "description": "Specify whether to create a new or existing virtual network for the VM."
      }
    },
    "virtualNetworkName": {
      "type": "String",
      "defaultValue": ""
    },
    "SubnetName": {
      "defaultValue": "subnet-5",
      "type": "String"
    },
    "SubnetPrefix": {
      "defaultValue": "10.0.5.0/24",
      "type": "String"
    },
    "nicName": {
      "type": "string"
    },
    "vhdUrl": {
      "type": "string",
      "metadata": {
        "description": "VHD Url..."
      }
    },
    "Datadisk1": {
      "type": "string",
      "metadata": {
        "description": "datadisk1 Url..."
      }
    },
    "Datadisk2": {
      "type": "string",
      "metadata": {
        "description": "datadisk2 Url..."
      }
    },
    "Datadisk3": {
      "type": "string",
      "metadata": {
        "description": "datadisk2 Url..."
      }
    }
  },
    "variables": {
         "addressPrefix": "10.0.0.0/16",
        "subnet1Name": "[parameters('SubnetName')]",
        "subnet1Prefix": "[parameters('SubnetPrefix')]",
        "publicIPAddressType": "Static",
        "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',parameters('virtualNetworkName'))]",
        "subnet1Ref": "[concat(variables('vnetID'),'/subnets/',variables('subnet1Name'))]",
        "osDiskVhdName": "[concat('http://',parameters('userStorageAccountName'),'.blob.core.windows.net/',parameters('userStorageContainerName'),'/',parameters('vmName'),'osDisk.vhd')]",     
        "dataDiskVhdName": "[concat('http://',parameters('userStorageAccountName'),'.blob.core.windows.net/',parameters('userStorageContainerName'),'/',parameters('vmName'),'datadisk')]",
		"imageName": "[concat(parameters('vmName'), '-image')]"
    },
	
    "resources": [
        {
            "apiVersion": "2015-05-01-preview",
            "type": "Microsoft.Network/publicIPAddresses",
            "name": "[parameters('publicIPAddressName')]",
            "location": "[parameters('location')]",
            "properties": {
                "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
                "dnsSettings": {
                    "domainNameLabel": "[parameters('dnsNameForPublicIP')]"
                }
            }
        },
		  {
            "type": "Microsoft.Compute/images",
            "apiVersion": "2019-12-01",
            "name": "[variables('imageName')]",
            "location": "[parameters('location')]",
            "properties": {
                "storageProfile": {
                    "osDisk": {
                        "osType": "[parameters('osType')]",
                        "osState": "Generalized",
                        "blobUri": "[parameters('vhdUrl')]",
                        "storageAccountType": "Standard_LRS"
                    },
                        "dataDisks": [
                          {
                            "lun": 0,
                            "blobUri": "[parameters('Datadisk1')]",
                            "storageAccountType": "Standard_LRS"
                          },
                          {
                            "lun": 1,
                            "blobUri": "[parameters('Datadisk2')]",
                            "storageAccountType": "Standard_LRS"
                          },
                          {
                            "lun": 2,
                            "blobUri": "[parameters('Datadisk3')]",
                            "storageAccountType": "Standard_LRS"
                          }                
                ]
                },
                "hyperVGeneration": "V2"
            }
        },
        {
            "apiVersion": "2015-05-01-preview",
            "type": "Microsoft.Network/virtualNetworks",
            "name": "[parameters('virtualNetworkName')]",
            "location": "[parameters('location')]",
            "properties": {
                "addressSpace": {
                    "addressPrefixes": [
                        "[variables('addressPrefix')]"
                    ]
                },
                "subnets": [
                    {
                        "name": "[variables('subnet1Name')]",
                        "properties": {
                            "addressPrefix": "[variables('subnet1Prefix')]"
                        }
                    }
                ]
            },
			"condition": "[equals(parameters('vNetNewOrExisting'), 'new')]"
        },
        {
            "apiVersion": "2016-09-01",
            "type": "Microsoft.Network/networkInterfaces",
            "name": "[parameters('nicName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]",
				"[concat('Microsoft.Network/virtualNetworks/', parameters('virtualNetworkName'))]"
            ],
            "properties": {
            
                "ipConfigurations": [
                    {
                        "name": "ipconfig1",
                        "properties": {
                            "privateIPAllocationMethod": "Dynamic",
                            "publicIPAddress": {
                                "id": "[resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName'))]"
                            },
                            "subnet": {
                                "id": "[variables('subnet1Ref')]"
                            }
                        }
                    }
                ]
            }
        },
        {
            "apiVersion": "2019-12-01",
            "type": "Microsoft.Compute/virtualMachines",
            "name": "[parameters('vmName')]",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Network/networkInterfaces/', parameters('nicName'))]",
				"[variables('imageName')]"
            ],
            "properties": {
                "hardwareProfile": {
                    "vmSize": "[parameters('vmSize')]"
                },
                "osProfile": {
                    "computername": "[parameters('vmName')]",
                    "adminUsername": "[parameters('adminUsername')]",
                    "adminPassword": "[parameters('adminPassword')]"
                },
                "storageProfile": { 
                     "imageReference": {
                        "id": "[resourceId('Microsoft.Compute/images', variables('imageName'))]"
                    }, 
                        "dataDisks": [
                       	{
               
       "name": "[concat(parameters('vmName'),'_DataDisk0')]",
        "lun": 0,
        "createOption": "FromImage",
         "managedDisk": {
          "storageAccountType": "Standard_LRS"  }
	},	  {
		   "name": "[concat(parameters('vmName'),'_DataDisk1')]",
                            "lun": 1,
                            "createOption": "FromImage",
                            "managedDisk": {
                                "storageAccountType": "Standard_LRS" }
	  },	  {
		   "name": "[concat(parameters('vmName'),'_DataDisk2')]",
                            "lun": 2,
                            "createOption": "FromImage",
                            "managedDisk": {
                                "storageAccountType": "Standard_LRS" }
	  }                
                ],
					
                    "osDisk": {
                        
                      "name": "[concat(parameters('vmName'),'-OSDisk')]",
                          "createOption": "FromImage",
                      "managedDisk": {
                     "storageAccountType": "Standard_LRS"
            
          
                    }
					}
                },
                "networkProfile": {
                    "networkInterfaces": [
                        {
                            "id": "[resourceId('Microsoft.Network/networkInterfaces',parameters('nicName'))]"
                        }
                    ]
                }
            }
        }
      ]
    } 

```

### Deploy an Azure VM using PowerShell

Copy and edit the following script to provide values for the `$storageaccount` and `$vhdUrl` variables. Execute it to create an Azure VM resource from your existing generalized VHD. <font color="red">code is powershell?</font>

```POWERSHELL
# storage account of existing generalized VHD

$storageaccount = "testwinrm11815" # generalized VHD URL
$vhdUrl = "https://testwinrm11815.blob.core.windows.net/vhds/testvm1234562016651857.vhd"

echo "New-AzResourceGroupDeployment -Name "dplisvvm$postfix" -ResourceGroupName "$rgName" -TemplateFile "C:\certLocation\VHDtoImage.json" -userStorageAccountName "$storageaccount" -dnsNameForPublicIP "$vmName" -subscriptionId "$mysubid" -location "$location" -vmName "$vmName" -vaultName "$kvname" -vaultResourceGroup "$rgName" -certificateUrl
$objAzureKeyVaultSecret.Id -vhdUrl "$vhdUrl" -vmSize "Standard\_A2" -publicIPAddressName "myPublicIP1" -virtualNetworkName "myVNET1" -nicName "myNIC1" -adminUserName "isv" -adminPassword $pwd"

# deploying VM with existing VHD

New-AzResourceGroupDeployment -Name"dplisvvm$postfix" -ResourceGroupName"$rgName" -TemplateFile"C:\certLocation\VHDtoImage.json" - userStorageAccountName"$storageaccount" -dnsNameForPublicIP"$vmName" -subscriptionId"$mysubid" -location"$location" - vmName"$vmName" -vaultName"$kvname" -vaultResourceGroup"$rgName" -certificateUrl$objAzureKeyVaultSecret.Id -vhdUrl"$vhdUrl" - vmSize"Standard\_A2" -publicIPAddressName"myPublicIP1" -virtualNetworkName"myVNET1" -nicName"myNIC1" -adminUserName"isv" - adminPassword$pwd
```

## Run validations

There are two ways to run validations on the deployed image.

### Use Certification Test Tool for Azure Certified

#### Download and run the certification test tool

The Certification Test Tool for Azure Certified runs on a local Windows machine but tests an Azure-based Windows or Linux VM. It certifies that your user VM image can be used with Microsoft Azure and that the guidance and requirements around preparing your VHD have been met.

1. Download and install the most recent [Certification Test Tool for Azure Certified](https://www.microsoft.com/download/details.aspx?id=44299).
2. Open the certification tool, then select **Start New Test**.
3. From the Test Information screen, enter a **Test Name** for the test run.
4. Select the Platform for your VM, either **Windows Server** or **Linux**. Your platform choice affects the remaining options.
5. If your VM is using this database service, select the **Test for Azure SQL Database** check box.

#### Connect the certification tool to a VM image

1. Select the SSH Authentication mode: Password Authentication or Key File Authentication.
1. If using password-based authentication, enter values for the **VM DNS Name**, **User name**, and **Password**. You can also change the default SSH Port number.

    :::image type="content" source="media/vm/azure-vm-cert-2.png" alt-text="Shows the selection of VM test information.":::

3. If using key file-based authentication, enter values for the VM DNS Name, User name, and Private key location. You can also include a Passphrase or change the default SSH Port number.

**Connect the certification tool to a Windows-based VM image** <font color="red">delete? seems to duplicate prior heading</font>

4. Enter the fully qualified VM DNS name (for example, MyVMName.Cloudapp.net).
5. Enter **User Name** and **Password**.

    :::image type="content" source="media/vm/azure-vm-cert-4.png" alt-text="Shows the selection of VM user name and password.":::

<font color="red">1. Select Next?</font>

#### Run a certification test

After you’ve given the parameter values for your VM image in the certification tool, select Test Connection to create a valid connection to your VM. After a connection is verified, select **Next** to start the test. When the test is complete, the results display in a table. The Status column shows (Pass/Fail/Warning) for each test. If any of the tests fail, your image is not certified. In this case, review the requirements and failure messages, make the suggested changes, and run the test again.

After the automated test completes, provide additional information about your VM image on the two tabs of the Questionnaire screen, General Assessment and Kernel Customization, and then select Next.

The last screen lets you provide more information, such as SSH access information for a Linux VM image, and an explanation for any failed assessments if you’re looking for exceptions.

Finally, select Generate Report to download the test results and log files for the executed test cases along with your answers to the questionnaire. Save the results in the same container as your VHDs.

### Use the self-test API

#### Self-test clients

How to call the self-test API:

![Shows the selection of VM test information](media/vm/azure-vm-self-test-clients.png)

#### Choose the Azure AD tenant where you want to create your applications

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the top bar, select your account and under the Directory list, choose the Active Directory tenant where you wish to register your application.
3. Select **All services* in the left-hand nav and choose **Azure Active Directory**.

In the next steps, you might need the tenant name (or directory name) or the tenant ID (or directory ID). These are presented in the Properties of the Azure Active Directory window respectively as Name and Directory ID.

#### Register the client app of Type Web App/API

1. Select App registrations and choose New application registration.

2. Enter a friendly name for the application, for example `SelfTestClient` and select `Web App/Api` as the Application Type. For the redirect URI, enter `https://isvapp.azurewebsites.net/selftest-vm`. Select **Create** to create the application.

3. On the next page, find and copy the **Application ID** value to the clipboard.

4. Configure permissions for your application.
    1. In the **Settings** menu, choose the Required permissions section.
    1. Select **Add**.
    1. Select an API.
    1. Enter **Windows Azure Service Management API** in the textbox and press Enter.
    1. Select **Windows Azure Service Management API** from the results and select **Select**.
    1. Select **Select Permissions** and select **Access Windows Azure Service Management API**.
    1. Select the **Select** button again to close this screen.
    1. Select **Done** to finish adding the permission.

1. Select **Properties**, set the check box to true, and save.

1. Select **Keys** in settings, create a secret key, and copy it to the clipboard as it will disappear after some time. We will use this key in the code below.

1. Create and Get the Token using PowerShell ADAL Library in below step.

#### Create token of your client Azure AD app

##### Get Token using POSTMAN using OAuth Rest API

To ask `Auth0` for tokens for any of your authorized applications, perform a POST operation to [https://login.microsoftonline.com/common/oauth2/token](https://login.microsoftonline.com/common/oauth2/token) endpoint with a payload in the following format:

```JSON
Method Type : POST
Base Url: https://login.microsoftonline.com/common/oauth2/token
Pass below parameters in Request Body:
Body Content-Type: x-www-form-urlencoded
client\_id: XXX (Paste your Application ID of Web App/API Type client AD App)
grant\_type: client\_credentials
client\_secret: XXX (Paste your Secret Key of Web App/API Type client AD App)
resource: [https://management.core.windows.net](https://management.core.windows.net/)
```

Pass these parameters in request headers:

```JSON
Content-Type: application/x-www-form-urlencoded
```

**Sample screen**:

:::image type="content" source="media/vm/create-token-sample-screen.png" alt-text="ample screen for creating tokens for client Azure AD app.":::

##### Get token using Curl in Linux using OAuth Rest API

To ask Auth0 for tokens for any of your authorized applications, perform a POST operation to `https:// login.microsoftonline.com/common/oauth2/token` endpoint with a payload in the following format:

**Request**:

```JSON
curl --request POST \
    --url ‘https://login.microsoftonline.com/common/oauth2/token’ \
    --header “Content-Type:application/x-www-form-urlencoded” \
    --data “grant\_type=client\_credentials&amp;client\_id=XXXXX-XXXX-XXXX-XXXXXXX&amp;client\_secret=XXXXXXXXX&amp;resource=https://management.core.windows.net”
```

**Response**:

```JSON
{“token”:”UClCUUKxUlkdbhE1cHLz3kyjbIZYVh9eB34A5Q21Y3FPqKGSJs”,”expires”:”2014-02-17 18:46:08”}
```

**Sample screen**:

![Sample screen for Curl results.](media/vm/curl-sample-screen.png)

##### Get token using C# using OAuth Rest API

To ask `Auth0` for tokens for any of your authorized applications, perform a POST operation to the `https://sonamtenant.auth0.com/oauth/token` endpoint with a payload in the following format:

```JSON
string clientId = “Your Application Id”;
string clientSecret = “Your Application Secret”;
string audience = “https://management.core.windows.net”;
string authority = String.Format(System.Globalization.CultureInfo.InvariantCulture, “https://login.microsoftonline.com/common/oauth2/token”);
string grantType = “client\_credentials”;
var client = new RestClient(authority);
var request = new RestRequest(Method.POST);
request.AddHeader(“content-type”, “application/x-www-form- urlencoded”);

string requestBody = “grant\_type=“ + grantType + “&amp;” + “client\_id=“ + clientId + “&amp;” + “client\_secret=“ + clientSecret + “&amp;” + “resource=“ + audience;

request.AddParameter(“application/x-www-form-urlencoded”, requestBody, ParameterType.RequestBody);

IRestResponse response = client.Execute(request);

var content = response.Content;

var token = JObject.Parse(content)[“access\_token”];
```

##### Get token using PowerShell using OAuth Rest API

To ask Auth0 for tokens for any of your authorized applications, perform a POST operation to the `https://sonamtenant.auth0.com/oauth/token` endpoint with a payload in the following format:

```JSON
$clientId = “Application Id of AD Client APP”;
$clientSecret = “Secret Key of AD Client APP “
$audience = “https://management.core.windows.net”;
$authority = “https://login.microsoftonline.com/common/oauth2/token”
$grantType = “client\_credentials”;

$requestBody = “grant\_type=“ + $grantType + “&amp;” + “client\_id=“ + $clientId + “&amp;” + “client\_secret=“ + $clientSecret + “&amp;” + “resource=“ + $audience;

$headers = New-Object “System.Collections.Generic.Dictionary[[String],[String]]”
$headers.Add(“ContentType”, “application/x-www-form-urlencoded”)
resp = Invoke-WebRequest -Method Post -Uri $authority -Headers $headers -ContentType ‘application/x-www-form-urlencoded’ -Body $requestBody

$token = $resp.Content | ConvertFrom-Json
$token.AccessToken
```

##### Calling Self-Test API

The self-test API contains a single endpoint that supports only the POST method. It uses this structure:

```JSON
Uri: https://isvapp.azurewebsites.net/selftest-vm
Method: Post
Request Header: Content-Type: “application/json”
Authorization: “Bearer xxxx-xxxx-xxxx-xxxxx”
Request body: The Request body parameters should use the following JSON format:
    {
“DNSName”:”XXXX.westus.cloudapp.azure.com”,
“User”:”XXX”,
“Password”:”XXX@1234567”,
“OS”:”XXX”,
“PortNo”:”22”,
“CompanyName”:”ABCD”,
“AppId”:” XXXX-XXXX-XXXX”,
“TenantId”:”XXXX-XXXX-XXXX” `
    }
```

These are the API fields:

| Field | Description |
| --- | --- |
| Authorization | The “Bearer xxxx-xxxx-xxxx-xxxxx” string contains the Azure Active Directory (AD) client token, which can be created by using PowerShell. |
| DNSName | DNS Name of the VM to test |
| UserName | User name for signing into the VM |
| Password | Password for signing into the VM or SSH public key |
| OS | Operating system of the VM: either Linux or Windows |
| PortNo | Open port number for connecting to the VM. The port number is typically 22 for Linux and 5986 for Windows. |
| AppId | Application ID of the AD Client Application used to create Token |
| TenantId | Tenant ID of the Azure subscription where AD Client App Resides. |

## How to use PowerShell to consume the Self-Test API <font color="red">reset to H2 level</font>

### On Linux OS

Call the API in PowerShell:

1. Use the Invoke-WebRequest command to call the API.
2. The method is Post and content type is JSON, as shown in the following code example and screen capture.
3. Specify the body parameters in JSON format.

This following example shows a PowerShell call to the API:

```POWERSHELL
$accesstoken = “token”
$headers = New-Object “System.Collections.Generic.Dictionary[[String],[String]]”
$headers.Add(“Authorization”, “Bearer $accesstoken”)
$DNSName = “\&lt;\&lt;Machine DNS Name\&gt;\&gt;”
$UserName = “\&lt;\&lt;User ID\&gt;\&gt;”
$Password = “\&lt;\&lt;Password\&gt;\&gt;”
$OS = “Linux”
$PortNo = “22”
$CompanyName = “ABCD”
$AppID = “\&lt;\&lt;Application ID\&gt;\&gt;”
$TenantId = “\&lt;\&lt;Tenant ID\&gt;\&gt;”

$body =
@{
DNSName = $DNSName
UserName = $UserName
Password = $Password
OS = $OS
PortNo = $PortNo
CompanyName = $CompanyName
AppID = $AppID
TenantId = $TenantId
}| ConvertTo-Json

$body

$uri = “URL”

$res = (Invoke-WebRequest -Method “Post” -Uri $uri -Body $body -ContentType “application/json” -Headers $headers).Content
```

Here's an example of calling the API in PowerShell:

[![Screen example for calling the API in PowerShell.](media/vm/calling-api-in-powershell.png)](media/vm/calling-api-in-powershell.png#lightbox)

Using the previous example, you can retrieve the JSON and parse it to get the following details:

```PowerShell
$resVar=$res|ConvertFrom-Json

$actualresult =$resVar.Response |ConvertFrom-Json

Write-Host”OSName: $($actualresult.OSName)”Write-Host”OSVersion: $($actualresult.OSVersion)”Write-Host”Overall Test Result: $($actualresult.TestResult)”For ($i=0; $i -lt$actualresult.Tests.Length; $i++){ Write-Host”TestID: $($actualresult.Tests[$i].TestID)”Write-Host”TestCaseName: $($actualresult.Tests[$i].TestCaseName)”Write-Host”Description: $($actualresult.Tests[$i].Description)”Write-Host”Result: $($actualresult.Tests[$i].Result)”Write-Host”ActualValue: $($actualresult.Tests[$i].ActualValue)”}
```

This sample screen, which shows `$res.Content`, shows details of your test results in JSON format:

[![Screen example for calling the API in PowerShell with details of test results.](media/vm/calling-api-in-powershell-details.png)](media/vm/calling-api-in-powershell-details.png#lightbox)

Here's an example of JSON test results viewed in an online JSON viewer (such as [Code Beautify](https://codebeautify.org/jsonviewer) or [JSON Viewer](https://jsonformatter.org/json-viewer)).

![Test results in an online JSON viewer.](media/vm/test-results-json-viewer-1.png)

### On Windows OS

Call the API in PowerShell:

1. Use the Invoke-WebRequest command to call the API.
2. The method is Post and content type is JSON, as shown in the following code example and sample screen.
3. Create the body parameters in JSON format.

This code sample shows a PowerShell call to the API: <font color="red">line breaks missing?</font>

```PowerShell
$accesstoken = “Get token for your Client AAD App”$headers = New-Object”System.Collections.Generic.Dictionary[[String],[String]]”$headers.Add(“Authorization”, “Bearer $accesstoken”)$Body = @{ “DNSName” = “XXXX.westus.cloudapp.azure.com”“UserName” = “XXX”“Password” = “XXX@123456”“OS” = “Windows”“PortNo” = “5986”“CompanyName” = “ABCD” “AppID” = “XXXX-XXXX-XXXX” “TenantId” = “XXXX-XXXX-XXXX” } | ConvertTo-Json$res = Invoke-WebRequest -Method”Post” -Uri$uri -Body$Body -ContentType”application/json” –Headers $headers;$Content = $res | ConvertFrom-Json
```

These sample screens show example for calling the API in PowerShell:

**With SSH key**:

 :::image type="content" source="media/vm/call-api-with-ssh-key.png" alt-text="Calling the API in PowerShell with an SSH Key.":::

**With password**:

 :::image type="content" source="media/vm/call-api-with-password.png" alt-text="Calling the API in PowerShell with a password.":::

Using the previous example, you can retrieve the JSON and parse it to get the following details:

```Powershell
$resVar=$res|ConvertFrom-Json

$actualresult =$resVar.Response |ConvertFrom-Json

Write-Host”OSName: $($actualresult.OSName)”Write-Host”OSVersion: $($actualresult.OSVersion)”Write-Host”Overall Test Result: $($actualresult.TestResult)”For ($i=0; $i -lt$actualresult.Tests.Length; $i++){ Write-Host”TestID: $($actualresult.Tests[$i].TestID)”Write-Host”TestCaseName: $($actualresult.Tests[$i].TestCaseName)”Write-Host”Description: $($actualresult.Tests[$i].Description)”Write-Host”Result: $($actualresult.Tests[$i].Result)”Write-Host”ActualValue: $($actualresult.Tests[$i].ActualValue)”}
```

This screen, which shows `$res.Content`, shows the details of your test results in JSON format:

 :::image type="content" source="media/vm/test-results-json-format.png" alt-text="Details of test results in JSON format.":::

Here's an example of test results viewed in an online JSON viewer (such as [Code Beautify](https://codebeautify.org/jsonviewer) or [JSON Viewer](https://jsonformatter.org/json-viewer)).

![Test results in an online JSON viewer.](media/vm/test-results-json-viewer-2.png)

  ## How to use CURL to consume the Self-Test API on Linux OS

Call the API in CURL:

1. Use the curl command to call the API.
2. The method is Post and content type is JSON, as shown in the following code snippet.

```JSON
CURL POST -H “Content-Type:application/json”

-H “Authorization: Bearer XXXXXX-Token-XXXXXXXX”

[https://isvapp.azure-api.net/selftest-vm](https://isvapp.azure-api.net/selftest-vm)

-d ‘{ “DNSName”:”XXXX.westus.cloudapp.azure.com”, “UserName”:”XXX”, “Password”:”XXXX@123456”, “OS”:”Linux”, “PortNo”:”22”, “CompanyName”:”ABCD”, “AppId”:”XXXX-XXXX-XXXX”, “TenantId “XXXX-XXXX-XXXX”}’
```

Here's an example of using CURL to call the API:

![Example of using CURL to call the API.](media/vm/using-curl-call-api.png)

Here's the JSON results from the CURL call:

![JSON results from the CURL call.](media/vm/test-results-json-viewer-3.png)
