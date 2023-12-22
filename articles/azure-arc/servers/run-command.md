---
title: How to remotely and securely configure servers using Run command (Preview)
description: Learn how to remotely and securely configure servers using Run Command.
ms.date: 12/21/2023
ms.topic: conceptual
---

# Remotely and securely configure servers using Run command (Preview)

Run Command on Azure Arc-enabled servers (Public Preview) uses the Connected Machine agent to let you remotely and securely run a script inside your servers. This can be helpful for myriad scenarios across troubleshooting, recovery, diagnostics, and maintenance.

## Supported environment and configuration

- **Experiences:** Run Command is currently supported through Azure CLI and PowerShell. 

- **Operating Systems:** Run Command supports both Windows and Linux operating systems. 

- **Environments:** Run Command supports non-Azure environments including on-premises, VMware, SCVMM, AWS, GCP, and OCI.  

- **Cost:** Run Command is free of charge, however storage of scripts in Azure may incur billing.

- **Configuration:** Run Command doesn't require more configuration or the deployment of any extensions. The
Connected Machine agent version must be 1.33 or higher. 

## Run Command operations

Run Command on Azure Arc-enabled servers supports the following operations:

|Operation  |Description  |
|---------|---------|
|[Create](https://review.learn.microsoft.com/en-us/rest/api/hybridcompute/machine-run-commands/create-or-update?view=rest-hybridcompute-2023-10-03-preview&branch=main&tabs=HTTP) |The operation to create a run command. This runs the run command. |
|[Delete](/rest/api/hybridcompute/machine-run-commands/delete?view=rest-hybridcompute-2023-10-03-preview&tabs=HTTP) |The operation to delete a run command. If it's running, delete will also stop the run command. |
|[Get](/rest/api/hybridcompute/machine-run-commands/get?view=rest-hybridcompute-2023-10-03-preview&tabs=HTTP) |The operation to get a run command. |
|[List](/rest/api/hybridcompute/machine-run-commands/list?view=rest-hybridcompute-2023-10-03-preview&tabs=HTTP) |The operation to get all the run commands of an Azure Arc-enabled server. |
|[Update](/rest/api/hybridcompute/machine-run-commands/update?view=rest-hybridcompute-2023-10-03-preview&tabs=HTTP) |The operation to update the run command. This stops the previous run command. |
 
> [!NOTE]
> Output and error blobs are overwritten each time the run command script executes.
> 

## Example scenarios

Suppose you have an Azure Arc-enabled server called “2012DatacenterServer1” in resource group “ContosoRG” with Subscription ID “aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa”. Consider a scenario where you need to provide remote access to an endpoint for Windows Server 2012 / R2 servers. Access to Extended Security Updates enabled by Azure Arc requires access to the endpoint `microsoft.com/pkiops/certs`. You need to remotely configure a firewall rule that allows access to this endpoint. Use Run Command in order to allow connectivity to this endpoint.

### Example 1: Endpoint access with Run Command

Start off by creating a Run Command script to provide endpoint access to the `microsoft.com/pkiops/certs` endpoint on your target Arc-enabled server using the PUT operation.

To directly provide the script in line, use the following operation:

```
PUT https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand?api-version=2023-10-03-preview

{
  "location": "eastus2",
  "properties": {
    "source": {
      "script": " New-NetFirewallRule -DisplayName $ruleName -Direction Outbound -Action Allow -RemoteAddress $endpoint -RemotePort $port -Protocol $protocol”
    },
    "parameters": [
      {
        "name": "ruleName",
        "value": " Allow access to microsoft.com/pkiops/certs"
      },
      {
        "name": "endpoint",
        "value": ""microsoft.com/pkiops/certs"
      },
      {
        "name": "port",
        "value": 433
      },
      {
        "name": "protocol",
        "value": "TCP"
      }

    ],
    "asyncExecution": false,
    "runAsUser": "contoso-user1",
    "runAsPassword": "Contoso123!”
    "timeoutInSeconds": 3600,
    "outputBlobUri": "https://mystorageaccount.blob.core.windows.net/myscriptoutputcontainer/MyScriptoutput.txt",
    "errorBlobUri": "https://mystorageaccount.blob.core.windows.net/mycontainer/MyScriptError.txt"
  }
}
```

To instead link to the script file, you can use the Run Command operation’s ScriptURI option. For this it's assumed you have prepared a `newnetfirewallrule.ps1` file containing the in-line script and uploaded this script to blob storage.

```
PUT https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand?api-version=2023-10-03-preview

{
  "location": "eastus2",
  "properties": {
    "source": {
      "scriptUri": "https://mystorageaccount.blob.core.windows.net/myscriptoutputcontainer/newnetfirewallrule.ps1"
    },
    "parameters": [
      {
        "name": "ruleName",
        "value": " Allow access to microsoft.com/pkiops/certs"
      },
      {
        "name": "endpoint",
        "value": ""microsoft.com/pkiops/certs"
      },
      {
        "name": "port",
        "value": 433
      },
      {
        "name": "protocol",
        "value": "TCP"
      }

    ],
    "asyncExecution": false,
    "runAsUser": "contoso-user1",
    "runAsPassword": "Contoso123!”
    "timeoutInSeconds": 3600,
    "outputBlobUri": "https://mystorageaccount.blob.core.windows.net/myscriptoutputcontainer/MyScriptoutput.txt",
    "errorBlobUri": "https://mystorageaccount.blob.core.windows.net/mycontainer/MyScriptError.txt"
  }
}
```

SAS URL must provide read access to the blob. An expiry time of 24 hours is suggested for SAS URL. SAS URLs can be generated on Azure portal using blobs options or SAS token using `New-AzStorageBlobSASToken`. If generating SAS token using `New-AzStorageBlobSASToken`, the SAS URL format is: `base blob URL + "?"` + the SAS token from `New-AzStorageBlobSASToken`. 

Output and error blobs must be the AppendBlob type and their SAS URLs must provide read, append, create, write access to the blob. An expiration time of 24 hours is suggested for SAS URL. SAS URLs can be generated on Azure portal using blob's options, or SAS token from using New-`AzStorageBlobSASToken`.

### Example 2: Get Run Command details

To verify that you've correctly provisioned the Run Command, use the GET command to retrieve details on the provisioned Run Command:

```
GET https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand?api-version=2023-10-03-preview
```

### Example 3: Update the Run Command

Let’s suppose you want to open up access to an additional endpoint `*.waconazure.com` for connectivity to Windows Admin Center. You can update the existing Run Command with new parameters:


```
PATCH https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand?api-version=2023-10-03-preview

{
  "location": "eastus2",
  "properties": {
    "source": {
      "script": " New-NetFirewallRule -DisplayName $ruleName -Direction Outbound -Action Allow -RemoteAddress $endpoint -RemotePort $port -Protocol $protocol”
    },
    "parameters": [
      {
        "name": "ruleName",
        "value": " Allow access to WAC endpoint"
      },
      {
        "name": "endpoint",
        "value": “*.waconazure.com”
      },
      {
        "name": "port",
        "value": 433
      },
      {
        "name": "protocol",
        "value": "TCP"
      }
    ],
    "asyncExecution": false,
    "runAsUser": "contoso-user1",
    "runAsPassword": "Contoso123!",
    "timeoutInSeconds": 3600,
    "outputBlobUri": "https://mystorageaccount.blob.core.windows.net/myscriptoutputcontainer/MyScriptoutput.txt",
    "errorBlobUri": "https://mystorageaccount.blob.core.windows.net/mycontainer/MyScriptError.txt"
  }
}
```


### Example 4: List Run Commands

Ahead of deleting the Run Command for Endpoint Access, make sure there are no other Run Commands for the Arc-enabled server. You can use the list command to get all of the Run Commands:

```
LIST https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/
```

### Example 5: Delete a Run Command

If you no longer need the Run Command extension, you can delete it using the following command:

```
DELETE https://management.azure.com/subscriptions/ aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand?api-version=2023-10-03-preview
```

