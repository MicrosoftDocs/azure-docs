---
title: Query the state of a storage appliance using the `az networkcloud storageappliance run-read-command` for Operator Nexus
description: Step by step guide on using the `az networkcloud storageappliance run-read-command` to run diagnostic commands on a storage appliance.
author: PerfectChaos
ms.author: chaoschhapi
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 7/29/2025
ms.custom: template-how-to
---

# Query the state of a Storage Appliance using the `az networkcloud storageappliance run-read-command`

For situations where a user wishes to investigate issues with or otherwise inspect the state of an on-premises storage appliance, Operator Nexus provides the `az networkcloud storageappliance run-read-command` so that users can run read-only commands provided by the storage appliance vendor to retrieve information from it.

The command produces an output file containing the results of the run-read command execution, which is sent to a storage account as configured in the `CommandOutputSettings` of the Cluster resource.

Prerequisites
1. Install the latest version of the
   [appropriate CLI extensions](./howto-install-cli-extensions.md)
1. Get the Managed Resource Group name (cluster_MRG) that you created for the `Cluster` resource

[!INCLUDE [command-output-settings](./includes/run-commands/command-output-settings.md)]

## Execute a run-read command

The run-read command lets you run commands on a storage appliance that do not change anything. Valid commands and their arguments are determined by the vendor of the appliance, and may be found in the appropriate CLI documentation for that appliance. Commands are executed against the storage appliance with read-only permissions, and attempts to execute commands that would make changes on the appliance will fail.

> [!WARNING]
> Microsoft doesn't provide or support any Operator Nexus API calls that expect plaintext username and/or password to be supplied. The Nexus platform handles authentication with the storage appliance and it should not be necessary to provide credentials as part of the commands. Note any values sent are logged and are considered exposed secrets, which should be rotated and revoked. The Microsoft documented method for securely using secrets is to store them in an Azure Key Vault. If you have specific questions or concerns, submit a request via the Azure portal.

The command syntax for a single command is as follows, using the Pure FlashArrray command `purehw list` as an example:

```azurecli
az networkcloud storageappliance run-read-command --name "<storageApplianceName>" \
  --limit-time-seconds "<timeout>" \
  --commands "[{command:purehw,arguments:[list]}]" \
  --resource-group "<cluster_MRG>" \
  --subscription "<subscription>"
```

- `--name` is the name of the storage appliance resource on which to execute the command.
- The `--commands` parameter always takes a list of commands, even if there's only one command.
- Multiple commands can be provided in json format using the [Azure CLI Shorthand](https://aka.ms/cli-shorthand) notation.
- Any whitespace must be enclosed in single quotes.
- Any arguments for each command must also be provided as a list.

This command runs synchronously. If you wish to skip waiting for the command to complete, specify the `--no-wait --debug` options. For more information, see (how to track async operations).

When an optional argument `--output-directory` is provided, the output result is downloaded and extracted to the local directory. 

> [!WARNING]
> Using the `--output-directory` argument overwrites any files in the local directory that have the same name as the new files being created.

## Check the command status and view the output in a user specified storage account

Sample output is shown. It prints the top 4,000 characters of the result to the screen for convenience and provides a short-lived link to the storage blob containing the command execution result. You can use the link to download the zipped output file (tar.gz). To access the output, users need the appropriate access to the storage blob. For information on assigning roles to storage accounts, see [Assign an Azure role for access to blob data](/azure/storage/blobs/assign-azure-role-data-access?tabs=portal).

```output
  ====Action Command Output====
  + purearray list
  Name               ID                                    OS          Version
  contoso1purestor1  12345678-9abc-def0-1234-56789abcdef0  Purity//FA  6.5.10
  
  ================================
  Script execution result can be found in storage account:
  https://<storage_account_name>.blob.core.windows.net/sa-run-command-output/runcommand-output-0fedcba9-8765-4321-0fed-cba987654321.tar.gz
```

## DEPRECATED: How to view the output of an `az networkcloud storageappliance run-read-command` in the Cluster Manager Storage account

This guide walks you through accessing the output file that is created in the Cluster Manager Storage account when an `az networkcloud storageappliance run-read-command` is executed on a server. The name of the file is identified in the `az rest` status output.

1. Open the Cluster Manager Managed Resource Group for the Cluster where the server is housed and then select the **Storage account**.

1. In the Storage account details, select **Storage browser** from the navigation menu on the left side.

1. In the Storage browser details, select on **Blob containers**.

1. Select the command-outputs blob container.

1. Storage Account could be locked resulting in `403 This request is not authorized to perform this operation.` due to networking or firewall restrictions. Refer to the [cluster manager storage](#deprecated-method-verify-access-to-the-cluster-manager-storage-account) or the [customer-managed storage](#send-command-output-to-a-user-specified-storage-account) sections for procedures to verify access.

1. Select the output file from the run-read command. The file name can be identified from the `az rest --method get` command. Additionally, the **Last modified** timestamp aligns with when the command was executed.

1. You can manage & download the output file from the **Overview** pop-out.
