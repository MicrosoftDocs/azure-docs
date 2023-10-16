---
title: Firewall settings for Azure Lab Services
description: Learn how to determine the public IP address of VMs in a lab created using a lab plan so information can be added to firewall rules.
ms.lab-services: lab-services
ms.date: 08/28/2023
ms.topic: how-to
ms.custom: devdivchpfy22
---

# Determine firewall settings for Azure Lab Services

This article covers how to find the specific public IP address used by a lab in Azure Lab Services. You can use these IP addresses to configure your firewall settings and specify inbound and outbound rules to enable lab users to connect to their lab virtual machines.

Each organization or school configures their own network in a way that best fits their needs. Sometimes that includes setting firewall rules that block Remote Desktop Protocol (RDP) or Secure Shell (SSH) connections to machines outside their own network.  Because Azure Lab Services runs in the public cloud, some extra configuration maybe needed to allow lab users to access their VM when connecting from the local network.

Each lab uses single public IP address and multiple ports.  All VMs, both the template VM and lab VMs, use this public IP address.  The public IP address doesn't change for a lab.  Each VM is assigned a different port number. The port ranges for SSH connections are 4980-4989 and 5000-6999.  The port ranges for RDP connections are 4990-4999 and 7000-8999.  The combination of public IP address and port number is used to connect lab creators and lab users to the correct VM.

If you're using a version of Azure Lab Services prior to the [August 2022 Update](lab-services-whats-new.md), see [Firewall settings for labs when using lab accounts](how-to-configure-firewall-settings-1.md).

>[!IMPORTANT]
>Each lab has a different public IP address.

> [!NOTE]
> If your organization needs to perform content filtering, such as for compliance with the [Children's Internet Protection Act (CIPA)](https://www.fcc.gov/consumers/guides/childrens-internet-protection-act), you need to use 3rd party software.  For more information, read guidance on [content filtering with Lab Services](./administrator-guide.md#content-filtering).

## Find public IP for a lab

If you're using a customizable lab, then you can get the public IP address anytime after the lab is created.  If you're using a non-customizable lab, the lab must be published and have capacity of at least 1 to be able to get the public IP address for the lab.

You can use the `Az.LabServices` PowerShell module to get the public IP address for a lab.

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

For more examples of using the `Az.LabServices` PowerShell module and how to use it, see [Quickstart: Create a lab plan using PowerShell and the Azure modules](how-to-create-lab-plan-powershell.md) and [Quickstart: Create a lab using PowerShell and the Azure module](how-to-create-lab-powershell.md).  For more information about cmdlets available in the Az.LabServices PowerShell module, see [Az.LabServices reference](/powershell/module/az.labservices/).

## Conclusion

You can now determine the public IP address for a lab.  You can create inbound and outbound rules for the organization's firewall for the public IP address and the port ranges 4980-4989, 5000-6999, and 7000-8999.  Once the rules are updated, lab users can then access their VMs without the network firewall blocking access.

## Related content

- As an admin, [enable labs to connect to your virtual network](how-to-connect-vnet-injection.md).
- As a lab creator, work with your admin to [create a lab with a shared resource](how-to-create-a-lab-with-shared-resource.md).
- As a lab creator, [publish your lab](how-to-create-manage-template.md#publish-the-template-vm).
