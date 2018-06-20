## Custom Images in a CycleCloud Custer
An Azure CycleCloud installation uses recommended OS images for the clusters, but the use of Azure Marketplace images or custom images in nodes and nodearrays is also supported.

When using either Marketplace or custom images, additional attributes are needed to specify the version of the jetpack daemon that gets installed on the VMs at boot:

* `InstallJetpack` specifies that jetpack should be installed as part of the VM boot process. This should always be `true` for Marketplace images.

* `JetpackVersion` should match the CycleCloud application server version.

* Acceptable values for `jetpackplatform` are: `centos-6`,`centos-7`, `ubuntu-14`, `ubuntu-16`, and `windows`. This should match the operating system of the Marketplace Image. 

## Use an Azure Marketplace Image in a CycleCloud node
To specify that a cluster node should use an Azure Marketplace image include the following attributes on a node definition to identify the image:

```
    [[node marketplace]]
      Azure.Publisher = OpenLogic
      Azure.Offer = CentOS-HPC
      Azure.Sku = 7.4
      Azure.ImageVersion = 7.4.20180301
      Azure.OS = linux

      InstallJetpack = true
      JetpackVersion = 7.4.0
      JetpackPlatform = centos-7
      AwaitInstallation = true
```

The `Azure.*` attributes define the marketplace image to be used, and the easiest way to retrieve these is through the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/vm/image?view=azure-cli-latest#az-vm-image-list)

As an alternative to a specific version most publishers support referencing the latest image with a label: `Azure.ImageVersion = latest`.

## Use a custom image in a CycleCloud node

Custom images are useful for pre-installed applications that are used in a cluster, or to fulfill business or security requirements. (For instructions on creating custom images in Azure see: [Custom Linux Images](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-custom-images), [Custom Windows Images](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-custom-images))

The `ImageId` attribute is used to specify that a cluster node should use a private custom Azure image. This ID can be found in the Azure portal as the Resource ID for the image, and generally takes the form: `/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

In addition, the `ImageOS` attribute must be set to either `windows` or `linux`:

```
    [[node custom]]

      ImageId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
      ImageOS = linux

      InstallJetpack = true
      JetpackVersion = 7.1.0
      JetpackPlatform = centos-7
      AwaitInstallation = true
```
