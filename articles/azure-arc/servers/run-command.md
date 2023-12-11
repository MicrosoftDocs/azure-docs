---
title: How to remotely and securely configure servers using Run command (Preview)
description: Learn how to remotely and securely configure servers using Run Command.
ms.date: 12/11/2023
ms.topic: conceptual
---

# Remotely and securely configure servers using Run command (Preview)

Run Command on Azure Arc-enabled servers (Public Preview) uses the Connected Machine agent to let you remotely and securely run a script inside your servers. This can be helpful for myriad scenarios across troubleshooting, recovery, diagnostics, and maintenance.

## Supported environment and configuration

- **Experiences:** Run Command is currently supported through Azure CLI and PowerShell. 

- **Operating Systems:** Run Command supports both Windows and Linux operating systems. 

- **Environments:** Run Command supports non-Azure environments including on-premises, VMware, SCVMM, AWS, GCP, and OCI.  

- **Cost:** Run Command is free of charge, however storage of scripts in Azure may incur billing.

- **Configuration:** Run Command does not require additional configuration or the deployment of any extensions. The
Connected Machine agent version must be or higher. 

## Run Command operations

Run Command on Azure Arc-enabled servers supports the following operations:

|Operation  |Description  |
|---------|---------|
|Create |The operation to create a run command. This will run the run command. |
|Delete |The operation to delete a run command. If it is running, delete will also stop the run command. |
|Get |The operation to get a run command. |
|List |The operation to get all the run commands of an Azure Arc-enabled server. |
|Update |The operation to update the run command. This will stop the previous run command. |
 
## Example scenarios

Let’s suppose we have an Azure Arc-enabled server called “2012DatacenterServer1” in resource group “ContosoRG” with Subscription ID “aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa”. Consider a scenario where we need to provide remote access to an endpoint for Windows Server 2012 / R2 servers. Access to Extended Security Updates enabled by Azure Arc, requires access to the endpoint microsoft.com/pkiops/certs. We want to remotely configure a firewall rule that allows access to this endpoint. We can use Run Command in order to whitelist this endpoint. 

### Example 1: Endpoint access with Run Command

Let’s start off by creating a Run Command script to provide endpoint access to the “microsoft.com/pkiops/certs” endpoint on our target Arc-enabled server using the PUT operation.

To directly provide the script in line, we would use the following operation:

PUT https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand


```
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

To instead link to the script file, you can use the Run Command operation’s ScriptURI option. For this we assume, you have prepared a newnetfirewallrule.ps1 file containing the in-line script and uploaded this script to blob storage.

PUT https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand


```
{
  "location": "eastus2",
  "properties": {
    "source": {
      "scriptUri": "https://mystorageaccount.blob.core.windows.net/myscriptoutputcontainer/ newnetfirewallrule.ps1"
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

Suppose we want to verify that we’ve correctly provisioned the Run Command; we can use the GET command to retrieve details on the provisioned Run Command.

```
GET https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand
```

### Example 3: Update the Run Command

Let’s suppose we want to open up access to an additional endpoint `*.waconazure.com` for connectivity to Windows Admin Center. We can update the existing Run Command with new parameters.

PATCH https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand


```bash
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

Ahead of deleting the Run Command for Endpoint Access, we want to make sure that there are no other Run Commands for the Arc-enabled server. We can use the list command to get all of the Run Commands. 

```
LIST https://management.azure.com/subscriptions/aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/
```

### Example 5: Delete a Run Command

Suppose that we no longer need the Run Command extension, we can delete using the following command.

```
DELETE https://management.azure.com/subscriptions/ aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa/resourceGroups/ContosoRG/providers/Microsoft.HybridCompute/machines/2012DatacenterServer1/runCommands/EndpointAccessCommand
```

