<properties
   pageTitle="Troubleshooting Linux VM extension failures | Microsoft Azure"
   description="Learn about troubleshooting Azure Linux VM extension failures"
   services="virtual-machines-linux"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""
   tags="top-support-issue,azure-resource-manager"/>

<tags
   ms.service="virtual-machines-linux"
   ms.devlang="na"
   ms.topic="support-article"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="infrastructure-services"
   ms.date="03/29/2016"
   ms.author="kundanap"/>

# Troubleshooting Azure Linux VM extension failures

[AZURE.INCLUDE [virtual-machines-common-extensions-troubleshoot](../../includes/virtual-machines-common-extensions-troubleshoot.md)]

## Viewing extension status
Azure Resource Manager templates can be executed from the  Azure CLI. Once the template is executed, the extension status can be viewed from Azure Resource Explorer or the command line tools.

Here is an example:

Azure CLI:

      azure vm get-instance-view


Here is the sample output:

      Extensions:  {
      "ExtensionType": "Microsoft.Compute.CustomScriptExtension",
      "Name": "myCustomScriptExtension",
      "SubStatuses": [
        {
          "Code": "ComponentStatus/StdOut/succeeded",
          "DisplayStatus": "Provisioning succeeded",
          "Level": "Info",
          "Message": "    Directory: C:\\temp\\n\\n\\nMode                LastWriteTime     Length Name
              \\n----                -------------     ------ ----                              \\n-a---          9/1/2015   2:03 AM         11
              test.txt                          \\n\\n",
                      "Time": null
          },
        {
          "Code": "ComponentStatus/StdErr/succeeded",
          "DisplayStatus": "Provisioning succeeded",
          "Level": "Info",
          "Message": "",
          "Time": null
        }
    }
  ]

## Troubleshooting Extenson failures:

### Re-running the extension on the VM

If you are running scripts on the VM using Custom Script Extension, you could sometimes run into an error where VM was created successfully but the script has failed. Under these conditons, the recommended way to recover from this error is to remove the extension and rerun the template again.
Note: In future, this functionality would be enhanced to remove the need for uninstalling the extension.

#### Remove the extension from Azure CLI

      azure vm extension set --resource-group "KPRG1" --vm-name "kundanapdemo" --publisher-name "Microsoft.Compute.CustomScriptExtension" --name "myCustomScriptExtension" --version 1.4 --uninstall

Where "publsher-name" corresponds to the extension type from the output of "azure vm get-instance-view"
and name is the name of the extension resource from the template

Once the extension has been removed, the template can be re-executed to run the scripts on the VM.
