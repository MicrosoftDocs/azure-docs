---
title: Create an Azure confidential VM in the Azure portal
description: Learn how to quickly create a confidential virtual machine (confidential VM) in the Azure portal using Azure Marketplace images.
author: linuxelf001
ms.service: azure-virtual-machines
ms.topic: quickstart
ms.date: 08/24/2024
ms.author: Rakesh Ginjupalli
---

# **Quickstart: Create confidential VM in the Azure portal**

1. **Create a new Virtual Machine**  
   a. Visit [portal.azure.com/\#create/Microsoft.VirtualMachine](https://portal.azure.com/\#create/Microsoft.VirtualMachine). If not signed in, you'll be prompted to log in to your Azure account.

      Note: Alternatively, you can go to [portal.azure.com](https://portal.azure.com), locate "Virtual machines" in the left sidebar (If the sidebar is hidden, click the hamburger menu ☰ in the top-left corner to reveal it)

   b. On the **Virtual machines** page, click **Create** and choose **Azure virtual machine** from the dropdown menu.  
<br>

2. **Configure VM settings \- Basics**  
   The following settings represent the minimum required setup. Additional options are available to tailor the VM to your specific requirements.
   
    <table>
        <tr>
            <td colspan="3" rowspan="1">
                <p><strong>Project details</strong></p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Subscription</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Select an existing Azure subscription. Free trial accounts don't have access to the VMs used in this guide. One option is to use a <a href="https://azure.microsoft.com/pricing/purchase-options/azure-account?icid=payg">pay as you go subscription</a></p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Resource Group</p>
            </td>
            <td colspan="2" rowspan="1">
                <p><a href="https://learn.microsoft.com/azure/azure-resource-manager/management/manage-resource-groups-portal">Resource groups</a> in Azure organize related resources, allowing you to easily deploy, update, and delete them as a group. The dropdown allows you to select from a list of previously created Resource groups. If necessary, select <strong>Create new</strong>, enter a name, and select <strong>OK</strong> to create a new resource group.</p>
            </td>
        </tr>
        <tr>
            <td colspan="3" rowspan="1">
                <p><strong>Instance details</strong></p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Virtual machine name</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Enter a name for your new confidential VM, e.g., cvm-01</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Region</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Select the Azure region to deploy your new confidential VM. Currently 12 regions are supported (as of Aug 2024) for DCasv5/DCadsv5/ECasv5/ECadsv5 virtual machines: East US, West US, Switzerland North, Italy North, North Europe, West Europe, Germany West Central, UAE North, Japan East, Central India, East Asia, and Southeast Asia. For the latest updates on region support, <a href="https://azure.microsoft.com/global-infrastructure/services/?products%3Dvirtual-machines">see https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines</a></p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Availability options</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Single VM? Select <strong>No infrastructure redundancy required</strong></p>
                <p>Multiple VMs? Select <a href="https://learn.microsoft.com/azure/virtual-machine-scale-sets/overview">Virtual machine scale set</a></p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Security Type</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Select <strong>Confidential virtual machines</strong> from the dropdown</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Image</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Select the OS image to use for your VM. Select <strong>See all images</strong> to open Azure Marketplace. Select the filter <strong>Security Type</strong> > <strong>Confidential</strong> to show all available confidential VM images.</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Size</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Select <strong>All sizes</strong> to display a searchable and sortable list of supported VM sizes to choose from. </p>
                <p>Azure offers a choice of Trusted Execution Environment (TEE) options from both AMD and Intel, namely the DC and EC family. The v5 series from both DC and EC families support upto 96 vCPUs.</p>
                <ul>
                    <li><a href="https://learn.microsoft.com/azure/virtual-machines/sizes/general-purpose/dc-family">Read more</a> about DC family of general-purpose Confidential VMs</li>
                    <li><a href="https://learn.microsoft.com/azure/virtual-machines/sizes/memory-optimized/ec-family">Read more</a> about EC family of memory-optimized Confidential VMs, capable of handling extremely large amounts of data.</li>
                </ul>
            </td>
        </tr>
        <tr>
            <td colspan="3" rowspan="1">
                <p><strong>Administrator account</strong></p>
                If you're creating a Linux VM, select <strong>SSH public key</strong>. Use a BASH shell for SSH or install an SSH client, such as PuTTY.
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Authentication Type</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>SSH public key</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>Password</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Username</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Enter an administrator name for your VM, e.g., "AzureCVMadmin"</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>SSH public key source</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>Select the source of your public key from this dropdown</p>
                <p></p>
                <ul>
                    <li><strong>Generate new key pair</strong> is selected by default as Azure can automatically generate a new SSH keypair for you</li>
                    <li><strong>Use existing key</strong> stored in Azure will allow you to choose an existing public key from the Stored Keys dropdown which will appear after you have chosen this option</li>
                    <li><strong>Use existing public key</strong> will allow you to enter an existing SSH public key into a text field which will appear after you have chosen this option</li>
                </ul>
                <p></p>
                <p><a href="https://learn.microsoft.com/azure/virtual-machines/linux/mac-create-ssh-keys">Learn more about creating and using SSH keys in Azure</a> </p>
            </td>
            <td colspan="1" rowspan="1">
                <p>N/A</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Password</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>N/A</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>Enter your administrator password</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Confirm password</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>N/A</p>
            </td>
            <td colspan="1" rowspan="1">
                <p>Re-enter your administrator password</p>
            </td>
        </tr>
        <tr>
            <td colspan="3" rowspan="1">
                <p><strong>Inbound port rules</strong></p>
                <p>Select which confidential VM network ports are accessible from the public internet.</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Public inbound ports</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Make sure <strong>Allow selected ports</strong> is selected</p>
            </td>
        </tr>
        <tr>
            <td colspan="1" rowspan="1">
                <p>Select inbound ports</p>
            </td>
            <td colspan="2" rowspan="1">
                <p>Linux VM: select <strong>SSH (22)</strong> and <strong>HTTP (80)</strong> as required</p>
                <p>Windows VM: select <strong>RDP (3389)</strong> and <strong>HTTP (80)</strong> as required</p>
                <p></p>
                <p>Note: It's not recommended to allow RDP or SSH ports for production deployments.</p>
            </td>
        </tr>
    </table>

<br>

3. **Configure VM settings \- Disks**  
   Once the **Basics** settings are complete, select the **Disks** tab to continue configuration of your new confidential VM.

    <table>
      <tr>
        <td colspan="2" rowspan="1">
          <p><strong>VM disk encryption</strong></p>
        </td>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">
          <p>Confidential OS disk encryption</p>
        </td>
        <td colspan="1" rowspan="1">
          <p>Enable encrypt the OS disk at the VM deployment time</p>
        </td>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">
          <p>Key Management</p>
        </td>
        <td colspan="1" rowspan="1">
          <p>Select the type of key to use</p>
          <p></p>
          <ul>
            <li>Confidential disk encryption with a <strong>Platform-managed key</strong> is selected by default, which ensures keys are generated, stored and managed by Azure</li>
            <li>Select Confidential disk encryption with <strong>Customer-managed key</strong> if you prefer your keys are generated, stored and managed by you in your Azure Key Vault or Managed HSM. 
- If you choose to select customer managed key option, you should create a <strong> confidential disk encryption set </strong> before. You can create a Confidential disk encryption set, by creating an Azure Key Vault using the Premium pricing tier that includes support for HSM backed keys (While creating, it's important to enable purge protection for added security measures, for the access configuration, use the "Vault access policy" under "Access confidguration" tab) or alternatively, you can create an Azure Key Vault managed Hardware Security Module.
- In the Azure portal, search for and select Disk Encryption Sets.
- Select Create.
- For Subscription, select which Azure subscription to use.
- For Resource group, select or create a new resource group to use.
- For Disk encryption set name, enter a name for the set.
- For Region, select an available Azure region.
- For Encryption type, select Confidential disk encryption with a customer-managed key.
- For Key Vault, select the key vault you already created.
- Under Key Vault, select Create new to create a new key.
- If you selected an Azure managed HSM previously, use PowerShell or the Azure CLI to create the new key instead.
- For Name, enter a name for the key.
- For the key type, select RSA-HSM
- Select your key size
- Under Confidential Key Options select Exportable and set the Confidential operation policy as CVM confidential operation policy.
- Select Create to finish creating the key.
- Select Review + create to create new disk encryption set. Wait for the resource creation to complete successfully.
- Go to the disk encryption set resource in the Azure portal.
- When you see a blue info banner, please follow the instructions provided to grant access. On encountering a pink banner, simply select it to grant the necessary permissions to Azure Key Vault.

Important: You must perform this step to successfully create the confidential VM.
</ul>
</td>
</tr>
</table>

<br>

4. **Finish setup**  
* If needed, continue making additional changes to settings under the tabs **Networking**, **Management**, **Monitoring**, **Advanced** and **Tags**.  
* Select **Review \+ create** to validate your configuration.  
* Wait for validation to complete. If necessary, fix any validation issues, then select **Review \+ create** again.

<br>

5. **Connect to your new confidential VM**  
* To connect to a confidential VM with a Windows OS, see [How to connect and sign on to an Azure virtual machine running Windows](https://learn.microsoft.com/azure/virtual-machines/windows/connect-logon).
* For more information about connecting to Linux VMs, see [Quickstart: Create a Linux virtual machine in the Azure portal](https://learn.microsoft.com/azure/virtual-machines/linux/quick-create-portal).

<br>

6. **Cleanup**  
* Visit [https://portal.azure.com/\#browse/resourcegroups](https://portal.azure.com/\#browse/resourcegroups) to see all the resource groups you have created. You will be asked to log in if you haven’t done so already.  
* Select the resource group you created for this quickstart guide.  
* On the resource group's menu, select **Delete resource group**.  
* In the warning pane, enter the resource group's name to confirm the deletion.  
* Select **Delete** to delete all the resources created under the resource group.
<br>

## **FAQ**

1. **Can I convert a non-confidential VM into a confidential VM?**\
No. For security reasons, you must create a confidential VM as such from the start.

2. **Do I have to use the full-disk encryption scheme? Can I use a standard scheme instead?**\
The optional full-disk encryption scheme is Azure's most secure and meets the [Confidential Computing principles](https://azure.microsoft.com/blog/azure-confidential-computing/). However, you can also use other [disk encryption schemes](https://learn.microsoft.com/en-us/azure/virtual-machines/disk-encryption-overview) along with or instead of full-disk encryption. If you use multiple disk encryption schemes, double encryption might negatively affect performance.

3. **Can I enable Azure Accelerated Networking on confidential VMs?**\
No. Confidential VMs don't support Accelerated Networking. You can't enable Accelerated Networking for any confidential VM deployment, or any Azure Kubernetes Service cluster deployment that runs on Confidential Computing.

[Visit this link for more FAQs](https://learn.microsoft.com/azure/confidential-computing/confidential-vm-faq)

## Next steps

> [!div class="nextstepaction"]
> [Create a confidential VM with an ARM template](quick-create-confidential-vm-arm.md)
