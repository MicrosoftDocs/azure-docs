# Modes of Operation: Terraform and Azure

There are several ways to work with Terraform on Azure. In this tutorial, you learn to:

* Use [Azure Cloud Shell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview)
* Use Terminal on Mac
* Use [Bash on Windows](https://msdn.microsoft.com/en-us/commandline/wsl/about)
* Use a Linux VM

## Using Azure Cloud Shell with Terraform

Setting up Azure Cloud Shell is documented [here](https://docs.microsoft.com/en-us/azure/cloud-shell/quickstart) and takes about 5 minutes in total. You only need the first couple of steps, but feel free to explore the sections about using Azure CLI v2.0 and creating additional Azure resources.

As part of setting up Azure Cloud Shell for the first time, you give the ok to set up storage. The following screenshots show examples of what you get:

A new storage account in a resource group named something like "cloud-shell-storage-region":
![New Storage Account](https://golivearmstorage.blob.core.windows.net/public/newStorageAccount.png)

The contents look like this initially in the portal:
![Storage Contents Portal](https://golivearmstorage.blob.core.windows.net/public/storageAccountContents.png)

And this is what it looks like in bash:
![Storage Contents Bash](https://golivearmstorage.blob.core.windows.net/public/storageAccountContentsSSH.png)

Terraform works out of the box, along with Go and the Azure CLI v2.0 toolset. You are automatically authenticated by the integration with Azure Cloud Shell to work with resources inside the same Azure subscription.

![Terraform Init](https://golivearmstorage.blob.core.windows.net/public/terraformInCloudShell.png)

Resulting in:

![Terraform Apply](https://golivearmstorage.blob.core.windows.net/public/terraformInCloudShell2.png)

Your state persists in the clouddrive.

## Using Terminal on Mac with Terraform

Instructions for installing Terraform are [here.](https://www.terraform.io/intro/getting-started/install.html) Select the package for your OS (Mac). It downloads as a single executable file in your Downloads folder. Once you have it where you want it, add that folder to your path. Check your installation by typing 'terraform' at the prompt.

### Configuring your environment

Each Terraform module requires credentials to access your Azure subscription. These lines may be added to your main.tf:

```
# Configure the Microsoft Azure Provider
provider "azurerm" {
  subscription_id = "..."
  client_id       = "..."
  client_secret   = "..."
  tenant_id       = "..."
}
```

Alternately, you could use environment variables to store your credentials and reference them in your .tf file. Details are documented [here.](https://www.terraform.io/docs/configuration/variables.html#environment-variables)

A third alternative is to use a variables file. Put the variables file into your .gitignore so it doesn't get checked into source control. Details are [here.](https://www.terraform.io/docs/configuration/variables.html#variable-files)

You will probably benefit from installing the Azure CLI v2.0 as well. It's a great tool for testing things using lower level capabilities and for checking your work, along with the using the portal for that purpose. Instructions for installation are [here.](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest)

## Using Bash on Windows with Terraform

There are a few ways to run Bash on Windows. The installation details are [here.](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide)

To enter the Bash command prompt, open a command shell, type 'bash' and press enter. Follow the [instructions](https://www.terraform.io/intro/getting-started/install.html) to install Terraform on Linux from within Bash.

Follow the instructions in the section above: [Configuring your Environment]().

## Use a Linux VM

Instructions for installing Terraform are [here.](https://www.terraform.io/intro/getting-started/install.html) Select the package for your OS (Linux). Reference the section above to configure your environment: [Configuring your Environment]().


What's Next:

[Create a small VM cluster using the Module Registry](./tutorial_vm_cluster_module_registry.md)
[Create a small VM cluster using custom HCL](./tutorial_vm_cluster_hcl.md)
