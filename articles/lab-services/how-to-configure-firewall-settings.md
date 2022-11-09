---
title: Firewall settings for Azure Lab Services
description: Learn how to determine the public IP address of VMs in a lab created using a lab plan so information can be added to firewall rules.
ms.lab-services: lab-services
ms.date: 08/01/2022
ms.topic: how-to
ms.custom: devdivchpfy22
---

# Firewall settings for Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

> [!NOTE]
> If using a version of Azure Lab Services prior to the [August 2022 Update](lab-services-whats-new.md), see [Firewall settings for labs when using lab accounts](how-to-configure-firewall-settings-1.md).

Each organization or school will configure their own network in a way that best fits their needs.  Sometimes that includes setting firewall rules that block Remote Desktop Protocol (RDP) or Secure Shell (SSH) connections to machines outside their own network.  Because Azure Lab Services runs in the public cloud, some extra configuration maybe needed to allow students to access their VM when connecting from the campus network.

Each lab uses single public IP address and multiple ports.  All VMs, both the template VM and student VMs, will use this public IP address.  The public IP address won't change for the life of lab.  Each VM will have a different port number.  The port ranges for SSH connections are 4980-4989 and 5000-6999.  The port ranges for RDP connections are 4990-4999 and 7000-8999.  The combination of public IP address and port number is used to connect educators and students to the correct VM.  This article will cover how to find the specific public IP address used by a lab.  That information can be used to update inbound and outbound firewall rules so students can access their VMs.

>[!IMPORTANT]
>Each lab will have a different public IP address.

> [!NOTE]
> If your school needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you will need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Find public IP for a lab

If using a customizable lab, then we can get the public ip anytime after the lab is created.  If using a non-customizable lab, the lab must be published and have capacity of at least 1 to be able to get the public IP for the lab.

We're going to use the Az.LabServices PowerShell module to get the public IP address for a lab.  For more examples using Az.LabServices PowerShell module and how to use it, see [Quickstart: Create a lab plan using PowerShell and the Azure modules](quick-create-lab-plan-powershell.md) and [Quickstart: Create a lab using PowerShell and the Azure module](quick-create-lab-powershell.md).  For more information about cmdlets available in the Az.LabServices PowerShell module, see [Az.LabServices reference](/powershell/module/az.labservices/)

```powershell
$ResourceGroupName = "MyResourceGroup"
$LabName = "MyLab"
$LabPublicIP = $null

$lab =  Get-AzLabServicesLab -Name $LabName -ResourceGroupName $ResourceGroupName
if (-not $lab){
    Write-Error "Could find lab $($LabName) in resource group $($ResourceGroupName)."
}

if($lab.NetworkProfilePublicIPId){
    #Lab is using advance networking
    # Get public IP from networking properties
    $LabPublicIP = Get-AzResource -ResourceId $lab.NetworkProfilePublicIPId | Get-AzPublicIpAddress | Select-Object -expand IpAddress
}else{
    #Get first VM from lab
    # If customizable lab, this is the template VM
    # If non-customizable lab, this is the first VM published.
    $vm =  $lab | Get-AzLabServicesVM | Select -First 1

    if ($vm){
        if($vm.ConnectionProfileSshAuthority){
            $connectionAuthority = $vm.ConnectionProfileSshAuthority.Split(":")[0]
        }else{
            $connectionAuthority = $vm.ConnectionProfileRdpAuthority.Split(":")[0]
        }
        $LabPublicIP = [System.Net.DNS]::GetHostByName($connectionAuthority).AddressList.IPAddressToString | Where-Object {$_} | Select -First 1

    }
}

if ($LabPublicIP){
    Write-Output "Public IP for $($lab.Name) is $LabPublicIP."
}else{
    Write-Error "Lab must be published to get public IP address."
}
```

## Conclusion

Now we know the public IP address for the lab.  Inbound and outbound rules can be created for the organization's firewall for the public IP address and the port ranges 4980-4989, 5000-6999, and 7000-8999.  Once the rules are updated, students can access their VMs without the network firewall blocking access.

## Next steps

- As an admin, [enable labs to connect your vnet](how-to-connect-vnet-injection.md).
- As an educator, work with your admin to [create a lab with a shared resource](how-to-create-a-lab-with-shared-resource.md).
- As an educator, [publish your lab](how-to-create-manage-template.md#publish-the-template-vm).
