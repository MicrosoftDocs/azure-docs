<properties
   pageTitle="Troubleshooting Azure VM extensions failures | Microsoft Azure"
   description="Learn about troubleshooting Azure VM extension failures"
   services="virtual-machines"
   documentationCenter=""
   authors="kundanap"
   manager="timlt"
   editor=""
   tags="top-support-issue,azure-resource-manager"/>

<tags
   ms.service="virtual-machines"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="09/01/2015"
   ms.author="kundanap"/>

# Troubleshooting Azure VM Extension failures.

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] classic deployment model.


## Overview of Azure Resource Manager Templates.

Azure Resource Manager Template allows you to declaratively specify the Azure IaaS infrastructure in Json language by defining the dependencies between resources.


Click the article  [Authoring Extension Templates](virtual-machines-extensions-authoring-templates.md) to learn more about authoring templates for using Extensions.

In this article we'll learn about troubleshooting some of the common VM Extension failures.

## Viewing Extension Status:
Azure Resource Manager templates can be executed from Azure Powershell or Azure CLI. Once the template is executed, the extension status can be viewed from Azure Resource Explorer or the command line tools.
Here are some examples:

Azure CLI:

      azure vm get-instance-view

Azure Powershell:

      Get-AzureVM -ResourceGroupName $RGName -Name $vmName -Status

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

### Re-running the extension on the VM:

If you are running scripts on the VM using Custom Script Extension, you could sometimes run into an error where VM was created successful but the script has failed. Under these conditons, the recommended way to recover from this error is to remove the extension and rerun the template again.
Note: In future, this functionality would be enhanced to remove the need for uninstalling the extension.

#### Remove the extension from Azure CLI:

      azure vm extension set --resource-group "KPRG1" --vm-name "kundanapdemo" --publisher-name "Microsoft.Compute.CustomScriptExtension" --name "myCustomScriptExtension" --version 1.4 --uninstall

Where "publsher-name" corresponds to the extension type from the output of "azure vm get-instance-view"
and name is the name of the extension resource from the template

#### Remove the extension from Azure Powershell:

    Remove-AzureVMExtension -ResourceGroupName $RGName -VMName $vmName -Name "myCustomScriptExtension"

Once the extension has been removed, the template can be re-executed to run the scripts on the VM.
