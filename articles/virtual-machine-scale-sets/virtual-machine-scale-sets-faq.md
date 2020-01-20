---
title: Azure virtual machine scale sets FAQs
description: Get answers to the most frequently asked questions about virtual machine scale sets in Azure.
author: mayanknayar
tags: azure-resource-manager
ms.assetid: 76ac7fd7-2e05-4762-88ca-3b499e87906e
ms.service: virtual-machine-scale-sets
ms.topic: conceptual
ms.date: 05/24/2019
ms.author: manayar
---

# Azure virtual machine scale sets FAQs

Get answers to frequently asked questions about virtual machine scale sets in Azure.

## Top frequently asked questions for scale sets

### How many VMs can I have in a scale set?

A scale set can have 0 to 1,000 VMs based on platform images, or 0 to 600 VMs based on custom images.

### Are data disks supported within scale sets?

Yes. A scale set can define an attached data disks configuration that applies to all VMs in the set. For more information, see [Azure scale sets and attached data disks](virtual-machine-scale-sets-attached-disks.md). Other options for storing data include:

* Azure files (SMB shared drives)
* OS drive
* Temp drive (local, not backed by Azure Storage)
* Azure data service (for example, Azure tables, Azure blobs)
* External data service (for example, remote database)

### Which Azure regions support scale sets?

All regions support scale sets.

### How do I create a scale set by using a custom image?

Create and capture a VM image, then use that as the source for your scale set. For a tutorial on how to create and use a custom VM image, you can use the [Azure CLI](tutorial-use-custom-image-cli.md) or [Azure PowerShell](tutorial-use-custom-image-powershell.md)

### If I reduce my scale set capacity from 20 to 15, which VMs are removed?

Virtual machines are removed from the scale set evenly across update domains and fault domains to maximize availability. VMs with the highest IDs are removed first.

### What if I then increase the capacity from 15 to 18?

If you increase capacity to 18, then 3 new VMs are created. Each time, the VM instance ID is incremented from the previous highest value (for example, 20, 21, 22). VMs are balanced across fault domains and update domains.

### When I'm using multiple extensions in a scale set, can I enforce an execution sequence?

Yes, you can use scale set [extension sequencing](virtual-machine-scale-sets-extension-sequencing.md).

### Do scale sets work with Azure availability sets?

A regional (non-zonal) scale set uses *placement groups*, which act as an implicit availability set with five fault domains and five update domains. Scale sets of more than 100 VMs span multiple placement groups. For more information about placement groups, see [Working with large virtual machine scale sets](virtual-machine-scale-sets-placement-groups.md). An availability set of VMs can exist in the same virtual network as a scale set of VMs. A common configuration is to put control node VMs (which often require unique configuration) in an availability set and put data nodes in the scale set.

### Do scale sets work with Azure availability zones?

Yes! For more information, see the [scale set zone doc](./virtual-machine-scale-sets-use-availability-zones.md).


## Autoscale

### What are best practices for Azure Autoscale?

For best practices for Autoscale, see [Best practices for autoscaling virtual machines](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-autoscale-best-practices).

### Where do I find metric names for autoscaling that uses host-based metrics?

For metric names for autoscaling that uses host-based metrics, see [Supported metrics with Azure Monitor](https://azure.microsoft.com/documentation/articles/monitoring-supported-metrics/).

### Are there any examples of autoscaling based on an Azure Service Bus topic and queue length?

Yes. For examples of autoscaling based on an Azure Service Bus topic and queue length, see [Azure Monitor autoscaling common metrics](https://azure.microsoft.com/documentation/articles/insights-autoscale-common-metrics/).

For a Service Bus queue, use the following JSON:

```json
"metricName": "MessageCount",
"metricNamespace": "",
"metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.ServiceBus/namespaces/mySB/queues/myqueue"
```

For a storage queue, use the following JSON:

```json
"metricName": "ApproximateMessageCount",
"metricNamespace": "",
"metricResourceUri": "/subscriptions/s1/resourceGroups/rg1/providers/Microsoft.ClassicStorage/storageAccounts/mystorage/services/queue/queues/mystoragequeue"
```

Replace example values with your resource Uniform Resource Identifiers (URIs).


### Should I autoscale by using host-based metrics or a diagnostics extension?

You can create an autoscale setting on a VM to use host-level metrics or guest OS-based metrics.

For a list of supported metrics, see [Azure Monitor autoscaling common metrics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-autoscale-common-metrics).

For a full sample for virtual machine scale sets, see [Advanced autoscale configuration by using Resource Manager templates for virtual machine scale sets](https://docs.microsoft.com/azure/monitoring-and-diagnostics/insights-advanced-autoscale-virtual-machine-scale-sets).

The sample uses the host-level CPU metric and a message count metric.



### How do I set alert rules on a virtual machine scale set?

You can create alerts on metrics for virtual machine scale sets via PowerShell or Azure CLI. For more information, see [Azure Monitor PowerShell quickstart samples](https://azure.microsoft.com/documentation/articles/insights-powershell-samples/#create-alert-rules) and [Azure Monitor cross-platform CLI quickstart samples](https://azure.microsoft.com/documentation/articles/insights-cli-samples/#work-with-alerts).

The TargetResourceId of the virtual machine scale set looks like this:

/subscriptions/yoursubscriptionid/resourceGroups/yourresourcegroup/providers/Microsoft.Compute/virtualMachineScaleSets/yourvmssname

You can choose any VM performance counter as the metric to set an alert for. For more information, see [Guest OS metrics for Resource Manager-based Windows VMs](https://azure.microsoft.com/documentation/articles/insights-autoscale-common-metrics/#guest-os-metrics-resource-manager-based-windows-vms) and [Guest OS metrics for Linux VMs](https://azure.microsoft.com/documentation/articles/insights-autoscale-common-metrics/#guest-os-metrics-linux-vms) in the [Azure Monitor autoscaling common metrics](https://azure.microsoft.com/documentation/articles/insights-autoscale-common-metrics/) article.

### How do I set up autoscale on a virtual machine scale set by using PowerShell?

To set up autoscale on a virtual machine scale set by using PowerShell, see [automatically scale a virtual machine scale set](tutorial-autoscale-powershell.md). You can also configure autoscale with the [Azure CLI](tutorial-autoscale-cli.md) and [Azure templates](tutorial-autoscale-template.md)


### If I have stopped (deallocated) a VM, is that VM started as part of an autoscale operation?

No. If autoscale rules require additional VM instances as part of a scale set, a new VM instance is created. VM instances that are stopped (deallocated) are not started as part of an autoscale event. However, those stopped (deallocated) VMs may be deleted as part of an autoscale event that scales in the number of instances, the same way that any VM instance may be deleted based on the order of VM instance ID.



## Certificates

### How do I securely ship a certificate to the VM?

To securely ship a certificate to the VM, you can install a customer certificate directly into a Windows certificate store from the customer's key vault.

Use the following JSON:

```json
"secrets": [
    {
        "sourceVault": {
            "id": "/subscriptions/{subscriptionid}/resourceGroups/myrg1/providers/Microsoft.KeyVault/vaults/mykeyvault1"
        },
        "vaultCertificates": [
            {
                "certificateUrl": "https://mykeyvault1.vault.azure.net/secrets/{secretname}/{secret-version}",
                "certificateStore": "certificateStoreName"
            }
        ]
    }
]
```

The code supports Windows and Linux.

For more information, see [Create or update a virtual machine scale set](https://msdn.microsoft.com/library/mt589035.aspx).


### How do I use self-signed certificates provisioned for Azure Service Fabric Clusters?
For the latest example use the following azure CLI statement within azure shell, read Service Fabrics CLI module Example documentation, which will be printed to stdout:

```bash
az sf cluster create -h
```

Self-signed certificates can not be used for distributed trust provided by a Certificate Authority, and should not be used for any Service Fabric Cluster intended to host enterprise production solutions; for additional Service Fabric Security guidance, review [Azure Service Fabric Security Best Practices](https://docs.microsoft.com/azure/security/fundamentals/service-fabric-best-practices) and [Service Fabric cluster security scenarios](https://azure.microsoft.com/documentation/articles/service-fabric-cluster-security/).

### Can I specify an SSH key pair to use for SSH authentication with a Linux virtual machine scale set from a Resource Manager template?

Yes. The REST API for **osProfile** is similar to the standard VM REST API.

Include **osProfile** in your template:

```json
"osProfile": {
    "computerName": "[variables('vmName')]",
    "adminUsername": "[parameters('adminUserName')]",
    "linuxConfiguration": {
        "disablePasswordAuthentication": "true",
        "ssh": {
            "publicKeys": [
                {
                    "path": "[variables('sshKeyPath')]",
                    "keyData": "[parameters('sshKeyData')]"
                }
            ]
        }
    }
}
```

This JSON block is used in [this Azure quickstart template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-vm-sshkey/azuredeploy.json).

For more information, see [Create or update a virtual machine scale set](https://msdn.microsoft.com/library/azure/mt589035.aspx#linuxconfiguration).

### How do I remove deprecated certificates?

To remove deprecated certificates, remove the old certificate from the vault certificates list. Leave all the certificates that you want to remain on your computer in the list. This does not remove the certificate from all your VMs. It also does not add the certificate to new VMs that are created in the virtual machine scale set.

To remove the certificate from existing VMs, use a custom script extension to manually remove the certificates from your certificate store.

### How do I inject an existing SSH public key into the virtual machine scale set SSH layer during provisioning?

If you are providing the VMs only with a public SSH key, you don't need to put the public keys in Key Vault. Public keys are not secret.

You can provide SSH public keys in plain text when you create a Linux VM:

```json
"linuxConfiguration": {
    "ssh": {
        "publicKeys": [
            {
                "path": "path",
                "keyData": "publickey"
            }
        ]
    }
}
```

linuxConfiguration element name | Required | Type | Description
--- | --- | --- | ---
ssh | No | Collection | Specifies the SSH key configuration for a Linux OS
path | Yes | String | Specifies the Linux file path where the SSH keys or certificate should be located
keyData | Yes | String | Specifies a base64-encoded SSH public key

For an example, see [the 101-vm-sshkey GitHub quickstart template](https://github.com/Azure/azure-quickstart-templates/blob/master/101-vm-sshkey/azuredeploy.json).

### When I run `Update-AzVmss` after adding more than one certificate from the same key vault, I see the following message:

>Update-AzVmss: List secret contains repeated instances of /subscriptions/\<my-subscription-id>/resourceGroups/internal-rg-dev/providers/Microsoft.KeyVault/vaults/internal-keyvault-dev, which is disallowed.

This can happen if you try to re-add the same vault instead of using a new vault certificate for the existing source vault. The `Add-AzVmssSecret` command does not work correctly if you are adding additional secrets.

To add more secrets from the same key vault, update the $vmss.properties.osProfile.secrets[0].vaultCertificates list.

For the expected input structure, see [Create or update a virtual machine set](https://msdn.microsoft.com/library/azure/mt589035.aspx).

Find the secret in the virtual machine scale set object that is in the key vault. Then, add your certificate reference (the URL and the secret store name) to the list associated with the vault.

> [!NOTE]
> Currently, you cannot remove certificates from VMs by using the virtual machine scale set API.
>

New VMs will not have the old certificate. However, VMs that have the certificate and which are already deployed will have the old certificate.

### Can I push certificates to the virtual machine scale set without providing the password, when the certificate is in the secret store?

You do not need to hard-code passwords in scripts. You can dynamically retrieve passwords with the permissions you use to run the deployment script. If you have a script that moves a certificate from the secret store key vault, the secret store `get certificate` command also outputs the password of the .pfx file.

### How does the Secrets property of virtualMachineProfile.osProfile for a virtual machine scale set work? Why do I need the sourceVault value when I have to specify the absolute URI for a certificate by using the certificateUrl property?

A Windows Remote Management (WinRM) certificate reference must be present in the Secrets property of the OS profile.

The purpose of indicating the source vault is to enforce access control list (ACL) policies that exist in a user's Azure Cloud Service model. If the source vault isn't specified, users who do not have permissions to deploy or access secrets to a key vault would be able to through a Compute Resource Provider (CRP). ACLs exist even for resources that do not exist.

If you provide an incorrect source vault ID but a valid key vault URL, an error is reported when you poll the operation.

### If I add secrets to an existing virtual machine scale set, are the secrets injected into existing VMs, or only into new ones?

Certificates are added to all your VMs, even pre-existing ones. If your virtual machine scale set upgradePolicy property is set to **manual**, the certificate is added to the VM when you perform a manual update on the VM.

### Where do I put certificates for Linux VMs?

To learn how to deploy certificates for Linux VMs, see [Deploy certificates to VMs from a customer-managed key vault](https://blogs.technet.microsoft.com/kv/2015/07/14/deploy-certificates-to-vms-from-customer-managed-key-vault/).

### How do I add a new vault certificate to a new certificate object?

To add a vault certificate to an existing secret, see the following PowerShell example. Use only one secret object.

```powershell
$newVaultCertificate = New-AzVmssVaultCertificateConfig -CertificateStore MY -CertificateUrl https://sansunallapps1.vault.azure.net:443/secrets/dg-private-enc/55fa0332edc44a84ad655298905f1809

$vmss.VirtualMachineProfile.OsProfile.Secrets[0].VaultCertificates.Add($newVaultCertificate)

Update-AzVmss -VirtualMachineScaleSet $vmss -ResourceGroup $rg -Name $vmssName
```

### What happens to certificates if you reimage a VM?

If you reimage a VM, certificates are deleted. Reimaging deletes the entire OS disk.

### What happens if you delete a certificate from the key vault?

If the secret is deleted from the key vault, and then you run `stop deallocate` for all your VMs and then start them again, you encounter a failure. The failure occurs because the CRP needs to retrieve the secrets from the key vault, but it cannot. In this scenario, you can delete the certificates from the virtual machine scale set model.

The CRP component does not persist customer secrets. If you run `stop deallocate` for all VMs in the virtual machine scale set, the cache is deleted. In this scenario, secrets are retrieved from the key vault.

You don't encounter this problem when scaling out because there is a cached copy of the secret in Azure Service Fabric (in the single-fabric tenant model).

### Why do I have to specify the certificate version when I use Key Vault?

The purpose of the Key Vault requirement to specify the certificate version is to make it clear to the user what certificate is deployed on their VMs.

If you create a VM and then update your secret in the key vault, the new certificate is not downloaded to your VMs. But your VMs appear to reference it, and new VMs get the new secret. To avoid this, you are required to reference a secret version.

### My team works with several certificates that are distributed to us as .cer public keys. What is the recommended approach for deploying these certificates to a virtual machine scale set?

To deploy .cer public keys to a virtual machine scale set, you can generate a .pfx file that contains only .cer files. To do this, use `X509ContentType = Pfx`. For example, load the .cer file as an x509Certificate2 object in C# or PowerShell, and then call the method.

For more information, see [X509Certificate.Export Method (X509ContentType, String)](https://msdn.microsoft.com/library/24ww6yzk(v=vs.110.aspx)).

### How do I pass in certificates as base64 strings?

To emulate passing in a certificate as a base64 string, you can extract the latest versioned URL in a Resource Manager template. Include the following JSON property in your Resource Manager template:

```json
"certificateUrl": "[reference(resourceId(parameters('vaultResourceGroup'), 'Microsoft.KeyVault/vaults/secrets', parameters('vaultName'), parameters('secretName')), '2015-06-01').secretUriWithVersion]"
```

### Do I have to wrap certificates in JSON objects in key vaults?

In virtual machine scale sets and VMs, certificates must be wrapped in JSON objects.

We also support the content type application/x-pkcs12.

We currently do not support .cer files. To use .cer files, export them into .pfx containers.



## Compliance and Security

### Are virtual machine scale sets PCI-compliant?

Virtual machine scale sets are a thin API layer on top of the CRP. Both components are part of the compute platform in the Azure service tree.

From a compliance perspective, virtual machine scale sets are a fundamental part of the Azure compute platform. They share a team, tools, processes, deployment methodology, security controls, just-in-time (JIT) compilation, monitoring, alerting, and so on, with the CRP itself. Virtual machine scale sets are Payment Card Industry (PCI)-compliant because the CRP is part of the current PCI Data Security Standard (DSS) attestation.

For more information, see [the Microsoft Trust Center](https://www.microsoft.com/TrustCenter/Compliance/PCI).

### Does [managed identities for Azure resources](https://docs.microsoft.com/azure/active-directory/msi-overview) work with virtual machine scale sets?

Yes. You can see some example MSI templates in Azure Quickstart templates for [Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-msi) and [Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-msi).

## Deleting 

### Will the locks I set in place on virtual machine scale set instances be respected when deleting instances?

In the Azure Portal, you have the ability to delete an individual instance or bulk delete by selecting multiple instances. If you attempt to delete a single instance that has a lock in place, the lock is respected and you will not be able to delete the instance. However, if you bulk select multiple instances and any of those instances have a lock in place, the lock(s) will not be respected and all of the selected instances will be deleted. 
 
In Azure CLI, you only have the ability to delete an individual instance. If you attempt to delete a single instance that has a lock in place, the lock is respected and you will not be able to delete that instance. 

## Extensions

### How do I delete a virtual machine scale set extension?

To delete a virtual machine scale set extension, use the following PowerShell example:

```powershell
$vmss = Get-AzVmss -ResourceGroupName "resource_group_name" -VMScaleSetName "vmssName"

$vmss=Remove-AzVmssExtension -VirtualMachineScaleSet $vmss -Name "extensionName"

Update-AzVmss -ResourceGroupName "resource_group_name" -VMScaleSetName "vmssName" -VirtualMacineScaleSet $vmss
```

You can find the extensionName value in `$vmss`.

### Is there a virtual machine scale set template example that integrates with Azure Monitor logs?

For a virtual machine scale set template example that integrates with Azure Monitor logs, see the second example in [Deploy an Azure Service Fabric cluster and enable monitoring by using Azure Monitor logs](https://github.com/krnese/AzureDeploy/tree/master/OMS/MSOMS/ServiceFabric).

### How do I add an extension to all VMs in my virtual machine scale set?

If update policy is set to **automatic**, redeploying the template with the new extension properties updates all VMs.

If update policy is set to **manual**, first update the extension, and then manually update all instances in your VMs.

### If the extensions associated with an existing virtual machine scale set are updated, are existing VMs affected?

If the extension definition in the virtual machine scale set model is updated and the upgradePolicy property is set to **automatic**, it updates the VMs. If the upgradePolicy property is set to **manual**, extensions are flagged as not matching the model.

### Are extensions run again when an existing machine is service-healed or reimaged?

If an existing VM is service-healed, it appears as a reboot, and the extensions are not run again. If a VM is reimaged, the process is similar replacing the OS drive with the source image. Any specialization from the latest model, such as extensions, are run again.

### How do I join a virtual machine scale set to an Active Directory domain?

To join a virtual machine scale set to an Active Directory (AD) domain, you can define an extension.

To define an extension, use the JsonADDomainExtension property:

```json
"extensionProfile": {
    "extensions": [
        {
            "name": "joindomain",
            "properties": {
                "publisher": "Microsoft.Compute",
                "type": "JsonADDomainExtension",
                "typeHandlerVersion": "1.3",
                "settings": {
                    "Name": "[parameters('domainName')]",
                    "OUPath": "[variables('ouPath')]",
                    "User": "[variables('domainAndUsername')]",
                    "Restart": "true",
                    "Options": "[variables('domainJoinOptions')]"
                },
                "protectedsettings": {
                    "Password": "[parameters('domainJoinPassword')]"
                }
            }
        }
    ]
}
```

### My virtual machine scale set extension is trying to install something that requires a reboot.

If your virtual machine scale set extension is trying to install something that requires a reboot, you can use the Azure Automation Desired State Configuration (Automation DSC) extension. If the operating system is Windows Server 2012 R2, Azure pulls in the Windows Management Framework (WMF) 5.0 setup, reboots, and then continues with the configuration.

### How do I turn on antimalware in my virtual machine scale set?

To turn on antimalware on your virtual machine scale set, use the following PowerShell example:

```powershell
$rgname = 'autolap'
$vmssname = 'autolapbr'
$location = 'eastus'

# Retrieve the most recent version number of the extension.
$allVersions= (Get-AzVMExtensionImage -Location $location -PublisherName "Microsoft.Azure.Security" -Type "IaaSAntimalware").Version
$versionString = $allVersions[($allVersions.count)-1].Split(".")[0] + "." + $allVersions[($allVersions.count)-1].Split(".")[1]

$VMSS = Get-AzVmss -ResourceGroupName $rgname -VMScaleSetName $vmssname
echo $VMSS
Add-AzVmssExtension -VirtualMachineScaleSet $VMSS -Name "IaaSAntimalware" -Publisher "Microsoft.Azure.Security" -Type "IaaSAntimalware" -TypeHandlerVersion $versionString
Update-AzVmss -ResourceGroupName $rgname -Name $vmssname -VirtualMachineScaleSet $VMSS
```

### How do I execute a custom script that's hosted in a private storage account?

To execute a custom script that's hosted in a private storage account, set up protected settings with the storage account key and name. For more information, see [Custom Script Extension](https://azure.microsoft.com/documentation/articles/virtual-machines-windows-extensions-customscript/#template-example-for-a-windows-vm-with-protected-settings).

## Passwords

### How do I reset the password for VMs in my virtual machine scale set?

There are two main ways to change the password for VMs in scale sets.

- Change the virtual machine scale set model directly. Available with API 2017-12-01 and later.

    Update the admin credentials directly in the scale set model (for example using the Azure Resource Explorer, PowerShell or CLI). Once the scale set is updated, all new VMs have the new credentials. Existing VMs only have the new credentials if they are reimaged.

- Reset the password using the VM access extensions.

    Use the following PowerShell example:

    ```powershell
    $vmssName = "myvmss"
    $vmssResourceGroup = "myvmssrg"
    $publicConfig = @{"UserName" = "newuser"}
    $privateConfig = @{"Password" = "********"}

    $extName = "VMAccessAgent"
    $publisher = "Microsoft.Compute"
    $vmss = Get-AzVmss -ResourceGroupName $vmssResourceGroup -VMScaleSetName $vmssName
    $vmss = Add-AzVmssExtension -VirtualMachineScaleSet $vmss -Name $extName -Publisher $publisher -Setting $publicConfig -ProtectedSetting $privateConfig -Type $extName -TypeHandlerVersion "2.0" -AutoUpgradeMinorVersion $true
    Update-AzVmss -ResourceGroupName $vmssResourceGroup -Name $vmssName -VirtualMachineScaleSet $vmss
    ```

## Networking

### Is it possible to assign a Network Security Group (NSG) to a scale set, so that it applies to all the VM NICs in the set?

Yes. A Network Security Group can be applied directly to a scale set by referencing it in the networkInterfaceConfigurations section of the network profile. Example:

```json
"networkProfile": {
    "networkInterfaceConfigurations": [
        {
            "name": "nic1",
            "properties": {
                "primary": "true",
                "ipConfigurations": [
                    {
                        "name": "ip1",
                        "properties": {
                            "subnet": {
                                "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/virtualNetworks/', variables('vnetName'), '/subnets/subnet1')]"
                            },
                            "loadBalancerInboundNatPools": [
                                {
                                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/inboundNatPools/natPool1')]"
                                }
                            ],
                            "loadBalancerBackendAddressPools": [
                                {
                                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/loadBalancers/', variables('lbName'), '/backendAddressPools/addressPool1')]"
                                }
                            ]
                        }
                    }
                ],
                "networkSecurityGroup": {
                    "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/networkSecurityGroups/', variables('nsgName'))]"
                }
            }
        }
    ]
}
```

### How do I do a VIP swap for virtual machine scale sets in the same subscription and same region?

If you have two virtual machine scale sets with Azure Load Balancer front-ends, and they are in the same subscription and region, you could deallocate the public IP addresses from each one, and assign to the other. See [VIP Swap: Blue-green deployment in Azure Resource Manager](https://msftstack.wordpress.com/2017/02/24/vip-swap-blue-green-deployment-in-azure-resource-manager/) for example. This does imply a delay though as the resources are deallocated/allocated at the network level. A faster option is to use Azure Application Gateway with two backend pools, and a routing rule. Alternatively, you could host your application with [Azure App service](https://azure.microsoft.com/services/app-service/) which provides support for fast switching between staging and production slots.

### How do I specify a range of private IP addresses to use for static private IP address allocation?

IP addresses are selected from a subnet that you specify.

The allocation method of virtual machine scale set IP addresses is always “dynamic,” but that doesn't mean that these IP addresses can change. In this case, "dynamic" only means that you do not specify the IP address in a PUT request. Specify the static set by using the subnet.

### How do I deploy a virtual machine scale set to an existing Azure virtual network?

To deploy a virtual machine scale set to an existing Azure virtual network, see [Deploy a virtual machine scale set to an existing virtual network](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-existing-vnet).

### Can I use scale sets with Accelerated Networking?

Yes. To use accelerated networking, set enableAcceleratedNetworking to true in your scale set's networkInterfaceConfigurations settings. For example
```json
"networkProfile": {
    "networkInterfaceConfigurations": [
        {
            "name": "niconfig1",
            "properties": {
                "primary": true,
                "enableAcceleratedNetworking" : true,
                "ipConfigurations": [
                ]
            }
        }
    ]
}
```

### How can I configure the DNS servers used by a scale set?

To create a virtual machine scale set with a custom DNS configuration, add a dnsSettings JSON packet to the scale set networkInterfaceConfigurations section. Example:
```json
    "dnsSettings":{
        "dnsServers":["10.0.0.6", "10.0.0.5"]
    }
```

### How can I configure a scale set to assign a public IP address to each VM?

To create a virtual machine scale set that assigns a public IP address to each VM, make sure the API version of the Microsoft.Compute/virtualMachineScaleSets resource is 2017-03-30, and add a _publicipaddressconfiguration_ JSON packet to the scale set ipConfigurations section. Example:

```json
    "publicipaddressconfiguration": {
        "name": "pub1",
        "properties": {
        "idleTimeoutInMinutes": 15
        }
    }
```

### Can I configure a scale set to work with multiple Application Gateways?

Yes. You can add the resource IDs for multiple Application Gateway backend address pools to the _applicationGatewayBackendAddressPools_ list in the _ipConfigurations_ section of your scale set network profile.

## Scale

### In what case would I create a virtual machine scale set with fewer than two VMs?

One reason to create a virtual machine scale set with fewer than two VMs would be to use the elastic properties of a virtual machine scale set. For example, you could deploy a virtual machine scale set with zero VMs to define your infrastructure without paying VM running costs. Then, when you are ready to deploy VMs, increase the “capacity” of the virtual machine scale set to the production instance count.

Another reason you might create a virtual machine scale set with fewer than two VMs is if you're concerned less with availability than in using an availability set with discrete VMs. Virtual machine scale sets give you a way to work with undifferentiated compute units that are fungible. This uniformity is a key differentiator for virtual machine scale sets versus availability sets. Many stateless workloads do not track individual units. If the workload drops, you can scale down to one compute unit, and then scale up to many when the workload increases.

### How do I change the number of VMs in a virtual machine scale set?

To change the number of VMs in a virtual machine scale set in the Azure portal, from the virtual machine scale set properties section, click on the "Scaling" blade and use the slider bar.

### How do I define custom alerts for when certain thresholds are reached?

You have some flexibility in how you handle alerts for specified thresholds. For example, you can define customized webhooks. The following webhook example is from a Resource Manager template:

```json
{
    "type": "Microsoft.Insights/autoscaleSettings",
    "apiVersion": "[variables('insightsApi')]",
    "name": "autoscale",
    "location": "[parameters('resourceLocation')]",
    "dependsOn": [
        "[concat('Microsoft.Compute/virtualMachineScaleSets/', parameters('vmSSName'))]"
    ],
    "properties": {
        "name": "autoscale",
        "targetResourceUri": "[concat('/subscriptions/',subscription().subscriptionId, '/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Compute/virtualMachineScaleSets/', parameters('vmSSName'))]",
        "enabled": true,
        "notifications": [
            {
                "operation": "Scale",
                "email": {
                    "sendToSubscriptionAdministrator": true,
                    "sendToSubscriptionCoAdministrators": true,
                    "customEmails": [
                        "youremail@address.com"
                    ]
                },
                "webhooks": [
                    {
                        "serviceUri": "<service uri>",
                        "properties": {
                            "key1": "custommetric",
                            "key2": "scalevmss"
                        }
                    }
                ]
            }
        ]
    }
}
```


## Patching and operations

### Can I create a scale set in an existing resource group?

Yes, you can create a scale set in an existing resource group.

### Can I move a scale set to another resource group?

Yes, you can move scale set resources to a new subscription or resource group.

### How to I update my virtual machine scale set to a new image? How do I manage patching?

To update your virtual machine scale set to a new image, and to manage patching, see [Upgrade a virtual machine scale set](https://docs.microsoft.com/azure/virtual-machine-scale-sets/virtual-machine-scale-sets-upgrade-scale-set).

### Can I use the reimage operation to reset a VM without changing the image? (That is, I want reset a VM to factory settings rather than to a new image.)

Yes, you can use the reimage operation to reset a VM without changing the image. However, if your virtual machine scale set references a platform image with `version = latest`, your VM can update to a later OS image when you call `reimage`.

### Is it possible to integrate scale sets with Azure Monitor logs?

Yes, you can by installing the Azure Monitor extension on the scale set VMs. Here is an Azure CLI example:
```
az vmss extension set --name MicrosoftMonitoringAgent --publisher Microsoft.EnterpriseCloud.Monitoring --resource-group Team-03 --vmss-name nt01 --settings "{'workspaceId': '<your workspace ID here>'}" --protected-settings "{'workspaceKey': '<your workspace key here'}"
```
You can find the required workspaceId and workspaceKey in the Log Analytics workspace of Azure portal. On the Overview page, click the Settings tile. Click the Connected Sources tab at the top.

> [!NOTE]
> If your scale set _upgradePolicy_ is set to Manual, you need to apply the extension to the all VMs in the set by calling upgrade on them. In CLI this would be _az vmss update-instances_.

[!INCLUDE [azure-monitor-log-analytics-rebrand](../../includes/azure-monitor-log-analytics-rebrand.md)]

## Troubleshooting

### How do I turn on boot diagnostics?

To turn on boot diagnostics, first, create a storage account. Then, put this JSON block in your virtual machine scale set **virtualMachineProfile**, and update the virtual machine scale set:

```json
"diagnosticsProfile": {
    "bootDiagnostics": {
        "enabled": true,
        "storageUri": "http://yourstorageaccount.blob.core.windows.net"
    }
}
```

When a new VM is created, the InstanceView property of the VM shows the details for the screenshot, and so on. Here's an example:

```json
"bootDiagnostics": {
    "consoleScreenshotBlobUri": "https://o0sz3nhtbmkg6geswarm5.blob.core.windows.net/bootdiagnostics-swarmagen-4157d838-8335-4f78-bf0e-b616a99bc8bd/swarm-agent-9574AE92vmss-0_2.4157d838-8335-4f78-bf0e-b616a99bc8bd.screenshot.bmp",
    "serialConsoleLogBlobUri": "https://o0sz3nhtbmkg6geswarm5.blob.core.windows.net/bootdiagnostics-swarmagen-4157d838-8335-4f78-bf0e-b616a99bc8bd/swarm-agent-9574AE92vmss-0_2.4157d838-8335-4f78-bf0e-b616a99bc8bd.serialconsole.log"
}
```

## Virtual machine properties

### How do I get property information for each VM without making multiple calls? For example, how would I get the fault domain for each of the 100 VMs in my virtual machine scale set?

To get property information for each VM without making multiple calls, you can call `ListVMInstanceViews` by doing a REST API `GET` on the following resource URI:

/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.Compute/virtualMachineScaleSets/<scaleset_name>/virtualMachines?$expand=instanceView&$select=instanceView

### Can I pass different extension arguments to different VMs in a virtual machine scale set?

No, you cannot pass different extension arguments to different VMs in a virtual machine scale set. However, extensions can act based on the unique properties of the VM they are running on, such as on the machine name. Extensions also can query instance metadata on http://169.254.169.254 to get more information about the VM.

### Why are there gaps between my virtual machine scale set VM machine names and VM IDs? For example: 0, 1, 3...

There are gaps between your virtual machine scale set VM machine names and VM IDs because your virtual machine scale set **overprovision** property is set to the default value of **true**. If overprovisioning is set to **true**, more VMs than requested are created. Extra VMs are then deleted. In this case, you gain increased deployment reliability, but at the expense of contiguous naming and contiguous Network Address Translation (NAT) rules.

You can set this property to **false**. For small virtual machine scale sets, this doesn't significantly affect deployment reliability.

### What is the difference between deleting a VM in a virtual machine scale set and deallocating the VM? When should I choose one over the other?

The main difference between deleting a VM in a virtual machine scale set and deallocating the VM is that `deallocate` doesn’t delete the virtual hard disks (VHDs). There are storage costs associated with running `stop deallocate`. You might use one or the other for one of the following reasons:

- You want to stop paying compute costs, but you want to keep the disk state of the VMs.
- You want to start a set of VMs more quickly than you could scale out a virtual machine scale set.
  - Related to this scenario, you might have created your own autoscale engine and want a faster end-to-end scale.
- You have a virtual machine scale set that is unevenly distributed across fault domains or update domains. This might be because you selectively deleted VMs, or because VMs were deleted after overprovisioning. Running `stop deallocate` followed by `start` on the virtual machine scale set evenly distributes the VMs across fault domains or update domains.

### How do I take a snapshot of a virtual machine scale set instance?
Create a snapshot from an instance of a virtual machine scale set.

```azurepowershell-interactive
$rgname = "myResourceGroup"
$vmssname = "myVMScaleSet"
$Id = 0
$location = "East US"

$vmss1 = Get-AzVmssVM -ResourceGroupName $rgname -VMScaleSetName $vmssname -InstanceId $Id     
$snapshotconfig = New-AzSnapshotConfig -Location $location -AccountType Standard_LRS -OsType Windows -CreateOption Copy -SourceUri $vmss1.StorageProfile.OsDisk.ManagedDisk.id
New-AzSnapshot -ResourceGroupName $rgname -SnapshotName 'mySnapshot' -Snapshot $snapshotconfig
```

Create a managed disk from the snapshot.

```azurepowershell-interactive
$snapshotName = "myShapshot"
$snapshot = Get-AzSnapshot -ResourceGroupName $rgname -SnapshotName $snapshotName  
$diskConfig = New-AzDiskConfig -AccountType Premium_LRS -Location $location -CreateOption Copy -SourceResourceId $snapshot.Id
$osDisk = New-AzDisk -Disk $diskConfig -ResourceGroupName $rgname -DiskName ($snapshotName + '_Disk')
```
