### Create labs

Labs are the starting point in DevTest Labs. Once you create a lab, you can add users, set policies to control costs, and define images for VMs that users can create quickly. To learn how to create a lab in the Azure portal, see [Create a lab in Azure DevTest Labs](devtest-lab-create-lab.md). 

### Create VMs

You can create lab VMs in minutes by choosing from a wide variety of ready-made Azure Marketplace images. To learn about making selected Markeplace images available for lab users, see [Configure Azure Marketplace images](devtest-lab-configure-marketplace-images.md).

You can also install all needed software on a VM, save the VM as a custom image, and make the image available for your lab users to create VMs. For more information, see [Create a custom image](devtest-lab-create-custom-image-from-vm-using-portal.md).

If you use custom VM images, you can use an image factory to create and distribute your images. An image factory is a configuration-as-code solution that regularly builds and distributes your configured images automatically. This saves the time required to manually configure the system after a VM has been created with the base OS.

### Use reusable formulas for VMs

A DevTest Labs formula is a list of default property values for VMs. You can create a formula in the lab by picking an image, a VM size for CPU and RAM, and a virtual network. Lab users can see the formula and use it to create a VM. For more information, see [Manage DevTest Labs formulas](devtest-lab-manage-formulas.md).

### Use artifacts for flexible VM customization.

You can add artifacts to deploy and configure lab VMs. Artifacts can be:

- Tools that you want to install on the VM, like agents, Fiddler, or Visual Studio.
- Actions that you want to run on the VM, like cloning a repo.
- Applications that you want to test.

Many artifacts are available out-of-the-box. You can also create custom artifacts if you want more customization. You store the artifacts in a private Git repo you connect to your lab. For more information, see [Create custom artifacts for DevTest Labs](devtest-lab-artifact-author.md) and [Add an artifact repository to a lab](add-artifact-repository.md)

### Use policies to control costs.

In DevTest Labs, you can set lab policies to control:

- The maximum number of lab VMs a user can create.
- Auto-shutdown and auto-start policies to stop and restart all VMs at a particular times of day.

For more information, see [Define lab policies](devtest-lab-set-lab-policy.md).

### Delete lab VMs

When development is complete, you can delete all lab VMs at once by running a single PowerShell script. For more information, see [Delete all the lab VMs using a PowerShell script](./devtest-lab-faq.yml#how-do-i-automate-the-process-of-deleting-all-the-vms-in-my-lab-).

### Add a virtual network to a lab

DevTest Labs creates each lab in a new virtual network. If you have another virtual network you configured by using Azure ExpressRoute or site-to-site VPN, you can add it to your lab. The virtual network is then available for creating lab VMs. For more information, see [Configure a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md). 

You can also add an Active Directory domain join artifact to join a VM to a domain when the VM is created.

### Add users to labs

Users can access a lab by using a link that you share. For more information, see [Get a link to the lab](./devtest-lab-faq.yml#how-do-i-share-a-direct-link-to-my-lab-).

You can add users to a lab by using the Azure portal or a PowerShell script. For more information, see [Add lab owners, contributors, and users in Azure DevTest Labs](devtest-lab-add-devtest-user.md). Lab users don't need an Azure account, as long as they have a [Microsoft account](./devtest-lab-faq.yml). Lab users can't see VMs that other users create.

### Automate lab and environment creation

You can automate lab creation, including custom settings, by using a reusable Azure Resource Manager (ARM) template. For more information, see [Create a lab by using a Resource Manager template](./devtest-lab-faq.yml#how-do-i-create-a-lab-from-a-resource-manager-template-).

