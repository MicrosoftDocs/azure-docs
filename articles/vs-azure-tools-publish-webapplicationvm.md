<properties
   pageTitle="Publish-WebApplicationVM | Microsoft Azure"
   description="Learn how to deploy a web application to a virtual machine. This script creates the required resources in your Azure subscription if they don't exist."
   services="visual-studio-online"
   documentationCenter="na"
   authors="TomArcher"
   manager="douge"
   editor="" />
<tags
   ms.service="multiple"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="multiple"
   ms.date="04/18/2016"
   ms.author="tarcher" />

# Publish-WebApplicationVM (Windows PowerShell script)

Deploys a web application to a virtual machine. The script creates the required resources in your Azure subscription if they don't exist.

```
Publish-WebApplicationVM
–Configuration <configuration>
-SubscriptionName <subscriptionName>
-WebDeployPackage <packageName>
-VMPassword @{Name = "name"; Password = "password")
-DatabaseServerPassword @{Name = "name"; Password = "password"}
-SendHostMessagesToOutput
-Verbose
```

### Configuration

The path to the JSON configuration file that describes the details of the deployment.

|Aliases|none|
|---|---|
|Required?|true|
|Position|named|
|Default value|none|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

### SubscriptionName

The name of the Azure subscription in which you want to create the virtual machine.

|Aliases|none|
|---|---|
|Required?|false|
|Position|named|
|Default value|Uses the first subscription in the subscription file|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

### WebDeployPackage

The path to the web deployment package to publish to the virtual machine. You can create this package by using the Publish Web wizard in Visual Studio. See [How to: Create a Web Deployment Package in Visual Studio](https://msdn.microsoft.com/library/dd465323.aspx).

|Aliases|none|
|---|---|
|Required?|false|
|Position|named|
|Default value|none|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

### AllowUntrusted

If true, allow the use of certificates that aren't signed by a trusted root authority.

|Aliases|none|
|---|---|
|Required?|false|
|Position|named|
|Default value|false|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

### VMPassword

The credentials for the virtual machine account. Example: -VMPassword @{Name = "admin"; Password = "password"}

|Aliases|none|
|---|---|
|Required?|false|
|Position|named|
|Default value|none|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

### DatabaseServerPassword

The credentials for the SQL database in Azure. Example: -DatabaseServerPassword @{Name = "admin"; Password = "password"}

|Aliases|none|
|---|---|
|Required?|false|
|Position|named|
|Default value|none|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

### SendHostMessagesToOutput

If true, print messages from the script to the output stream.

|Aliases|none|
|---|---|
|Required?|false|
|Position|named|
|Default value|false|
|Accept pipeline input?|false|
|Accept wildcard characters?|false|

## Remarks

For a complete explanation of how to use the script to create Dev and Test environments, see [Using Windows PowerShell Scripts to Publish to Dev and Test Environments](vs-azure-tools-publishing-using-powershell-scripts.md).

The JSON configuration file specifies the details of what is to be deployed. It includes the information that you specified when you created the project, such as the name, affinity group, VHD image, and size of the virtual machine. It also includes the endpoints on the virtual machine, the databases to provision, if any, and web deployment parameters. The following code shows an example JSON configuration file:

```
{
    "environmentSettings": {
        "cloudService": {
            "name": "myvmname",
            "affinityGroup": "",
            "location": "West US",
            "virtualNetwork": "",
            "subnet": "",
            "availabilitySet": "",
            "virtualMachine": {
                "name": "myvmname",
                "vhdImage": "a699494373c04fc0bc8f2bb1389d6106__Windows-Server-2012-R2-201404.01-en.us-127GB.vhd",
                "size": "Small",
                "user": "vmuser1",
                "password": "",
                "enableWebDeployExtension": true,
                "endpoints": [
                    {
                        "name": "Http",
                        "protocol": "TCP",
                        "publicPort": "80",
                        "privatePort": "80"
                    },
                    {
                        "name": "Https",
                        "protocol": "TCP",
                        "publicPort": "443",
                        "privatePort": "443"
                    },
                    {
                        "name": "WebDeploy",
                        "protocol": "TCP",
                        "publicPort": "8172",
                        "privatePort": "8172"
                    },
                    {
                        "name": "Remote Desktop",
                        "protocol": "TCP",
                        "publicPort": "3389",
                        "privatePort": "3389"
                    },
                    {
                        "name": "Powershell",
                        "protocol": "TCP",
                        "publicPort": "5986",
                        "privatePort": "5986"
                    }
                ]
            }
        },
        "databases": [
            {
                "connectionStringName": "",
                "databaseName": "",
                "serverName": "",
                "user": "",
                "password": ""
            }
        ],
        "webDeployParameters": {
            "iisWebApplicationName": "Default Web Site"
        }
    }
}
```

You can edit the JSON configuration file to change what is provisioned. A virtual machine and a cloud service are required, but the database section is optional.
