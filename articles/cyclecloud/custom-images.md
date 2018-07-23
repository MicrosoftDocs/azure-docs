
# Custom Images in a CycleCloud Cluster

An Azure CycleCloud installation uses recommended OS images for clusters, but the use of Azure Marketplace images or custom images in nodes and nodearrays is also supported.

When using either Marketplace or custom images, additional attributes are needed to specify the version of the jetpack daemon that gets installed on the VMs at boot:

* `InstallJetpack` specifies that jetpack should be installed as part of the VM boot process. This should always be `true` for Marketplace images.

* Acceptable values for `jetpackplatform` are: `centos-6`,`centos-7`, `ubuntu-14`, `ubuntu-16`, and `windows`. This should match the operating system of the Marketplace Image.

## Use an Azure Marketplace Image in a CycleCloud Node

To specify that a cluster node should use an Azure Marketplace image, include the following attributes on a node definition to identify the image:

```
    [[node marketplace]]
      Azure.Publisher = OpenLogic
      Azure.Offer = CentOS-HPC
      Azure.Sku = 7.4
      Azure.ImageVersion = 7.4.20180301
      Azure.OS = linux

      InstallJetpack = true
      JetpackPlatform = centos-7
```

The `Azure.*` attributes define the marketplace image to be used. The easiest way to retrieve these attributes is through the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/vm/image?view=azure-cli-latest#az-vm-image-list).

As an alternative to a specific version, most publishers support referencing the latest image with a label: `Azure.ImageVersion = latest`.

### Use an Azure Marketplace Image with a Pricing Plan

You can use a Marketplace image with an associated pricing plan with CycleCloud. The image must be enabled for programmatic use. To do this, locate the Marketplace image you want to use. Click "Want to deploy programmatically", "Get Started ->", and enter any required information and save it.

To accept a license from the CLI:

      $> az vm image accept-terms --urn publisher:offer:sku:version

or

      $> az vm image accept-terms --publisher PUBLISHER --offer OFFER --plan SKU

## Use a Custom Image in a CycleCloud Node

Custom Images are useful for pre-installed applications in a cluster, or to fulfill business or security requirements.

The `ImageId` attribute is used to specify that a cluster node should use a private custom Azure image. This ID can be found in the Azure portal as the Resource ID for the image, and generally takes the form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

In addition, the `ImageOS` attribute must be set to either `windows` or `linux`:

```
    [[node custom]]

      ImageId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
      ImageOS = linux

      InstallJetpack = true
      JetpackPlatform = centos-7
```
## Create a Custom Image

Custom Azure Images can be created for [Windows](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-custom-images) or for [Linux](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-custom-images).
