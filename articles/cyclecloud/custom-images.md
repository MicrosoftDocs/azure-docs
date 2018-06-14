# Custom Machine Images

CycleCloud ships with a repository of pre-created images that are recommended for use by most users.

Some users may need to use custom images to fulfill business or security requirements.
CycleCloud supports building clusters from images created and owned entirely by the user.

## Custom User Images

CycleCloud supports custom images. Specify the image id directly with `ImageId`, or
add the image to the image registry. When the image is in the registry, reference
it with either `Image` or `ImageName` on your node. It will appear in the **image dropdown** on
the cluster creation page.

Images in the image registry consist of a `Package` record that identifies the
contents of the logical image and one or more corresponding `Artifact` records
that specify the actual image id in the appropriate cloud provider. For example,
a custom image with R installed on it might consist of this Package record:

    AdType = "Package"
    Name = "r_execute"
    Version = "2.1.1"
    PackageType = "image"
    Label = "R"

Once you add that record, you can specify that image by including either `Image = R` or `ImageName = r_execute` in the cluster template.

If this image existed as a single Azure Virtual Machine in East US with an id of `Order66`, it would need to have the following artifact stored:

    AdType = "Artifact"
    Package = "r_execute"
    Version = "2.1.1"
    Name = "az/ue"
    Provider = "az"
    ImageId = "Order66"

You must specify `Provider` on the artifact.

You can add as many artifacts as you want for a given image package, but you must include all the artifacts
required to use that image in all the "locations" you want (one per cloud provider account, regions, projects, etc). The name of the artifact is not important, except that it must be unique to all artifacts for a given package and version. Using a combination of the provider and provider-specific details (eg region) is usually recommended. CycleCloud automatically picks the right artifact to match the provider and any provider-specific details, but it uses the Provider attribute (and Region, etc) rather than parsing the Name.

If you add more than one image package with the same name, they must have different version numbers.
When starting an instance, CycleCloud will automatically pick the image with the highest version number,
by treating the version number as a dotted string and comparing each part as a number.
For instance, 2.0 is newer than 1.2, 1.10 is newer than 1.2, and 1.2.3 is newer than 1.2.
To override this, specify `ImageVersion` on the node, as either a literal (eg `1.2`) or a wildcard (`1.x`).

You can also automatically import a set of image ids be used in CycleCloud.

## Azure Custom Images

Private custom Azure images can be specified in the template file with the ImageID attribute. This ID can be found in the Azure portal as the Resource ID for the image. In addition, the ImageOS attribute must be set to either `windows` or `linux`:

    [[node demo]]

      ImageId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
      ImageOS = linux

      Azure.Publisher = OpenLogic
      Azure.Offer = CentOS-HPC
      Azure.Sku = 7.4
      Azure.ImageVersion = 7.4.20180301
      Azure.OS = linux

      InstallJetpack = true
      JetpackVersion = 7.1.0
      JetpackPlatform = centos-7
      AwaitInstallation = true

`jetpackplatform = windows` works for all versions of Windows, or with centos-6, centos-7, ubuntu-14, or ubuntu-16 only. If jetpack will not be installed, set the `installjetpack` attribute to false and leave out the remaining information.

## Azure Marketplace Images

Azure Marketplace images can be directly specified as well. The following attributes must be set to identify the image:

    [[node demo]]

      Azure.Publisher = OpenLogic
      Azure.Offer = CentOS-HPC
      Azure.Sku = 7.4
      Azure.ImageVersion = 7.4.20180301
      Azure.OS = linux

      InstallJetpack = true
      JetpackVersion = 7.1.0
      JetpackPlatform = centos-7
      AwaitInstallation = true

As an alternative to specific version most publishers support referencing the latest image with a label: `Azure.ImageVersion = latest`.

## Jetpack

CycleCloud can launch instances using any Machine Image. However, to build clusters
using CycleCloud and to benefit from CycleCloud's orchestration layer, Cycle Computing's
`Jetpack <https://docs.cyclecomputing.com/admin-guide-v6.8.0/jetpack>`_ package must be installed on the Image.  If the image does not have
Jetpack installed, then many of the features of CycleCloud will be lost.

Users have two options for installing Jetpack:

#. Use images provided by Cycle Computing that already have Jetpack installed
#. Install Jetpack on an existing image to create a custom Jetpack image

For new images that are not managed by CycleCloud, you must specify which version and platform of Jetpack to install:

    [[node demo]]

      InstallJetpack = true
      JetpackVersion = 7.1.0
      JetpackPlatform = centos-7
      AwaitInstallation = true

Jetpack packages are currently built for the following operating systems:
- Enterprise Linux 6, 7 (CentOS, RHEL)
- Ubuntu 14.04, 16.04
- Microsoft Windows

# CycleCloud Image Requirements

1. Jetpack must be installed on the Image.

2. Jetpack uses Chef to configure instances launched using the Image. In order for Chef to function, other infrastructure configuration management tools should be disabled.

3. Management ports, such as TCP port 22, SSH (Secure Shell), and port 3389 RDP (Remote Desktop Protocol), should be open in the security group and on an instance's firewall during the image baking process.


## Custom Configuration

Once the new instance has started, use the private key to log in to the instance. For the example in this guide, the keypair allows direct access to the instance as root. If your base image uses a different default user, be sure that the user has sudo access.

Next, install any custom software and configurations that your cluster requires.

It is recommended to create a shell script which automates the software download and installation. Such a script can later be used with CycleCloud to orchestrate image rebuilding.


## Chef/Cluster-Init vs. Image Baking

All user-level software is installed and configured using Chef and/or Cluster-Init at cluster startup. You may be able to reduce launch times by pre-installing some software or pre-downloading the packages for software that may only be installed after launch. When making the decision what to burn into the image, here are some questions to think about:

1. Do all users of this image need this software? Or is it required by policy?

 - A great candidate for baking into the image would be software such as anti-virus programs that are required by policy and may be updated dynamically on each launch.

2. Can this software be updated when instances are launched?

 - If not, the you may end up baking new images every time a new version is released.

3. Does this software require customization at install time that can only be done after instance launch?

 - Grid-enabled software often needs to be configured with hostnames and ips of actual, running instances based on cluster search results. (You may still be able to install the software prior to baking the image, and use Chef to re-configure it at instance start-up.)

4. Does this software package belong on the root volume of the instance?

 - If the software should be installed on EBS or the ephemeral drive, then it cannot be installed directly on the image.

If the software cannot easily be installed prior to image baking, consider including a copy of the installer for use by CycleCloud's Thunderball cookbook to avoid the download at instance startup until the installer is updated.

## Custom Image Clean-Up

An important part of building a new image is to ensure only the files that you want launched from a saved VM on every instance exist on the instance at the time the VM image is captured.

Prior to baking the image, remove the installer and all other temporary files from the instance to avoid saving unnecessary clutter in your image.

To clean your image prior to baking:

1. Disable password based login for all users:

    <$ passwd -l root

2. (Optional) Configure `sshd_config` according to your policies.

3. (Optional) Configure the instance level firewall according to your policies.

4. Remove any temporary files and installers for you custom installations.

5. Remove the Jetpack installer and install dir:

    $ cd /tmp
    $ rm -rf jetpack*

6. Remove any system logs that may contain sensitive data.

7. If you mounted and formatted the ephemeral drive for the instance (or let Cloud-Init do it for you), then be sure to remove the mount configuration from the `/etc/fstab` file.

8. Clear the bash history for all users, but in particular for `root`:

    $ sudo su -
    $ history -w
    $ history -c

9. Remove the authorized key for the key-pair you used to log in (**Do this last!** Once you perform this step, you won't be able to log back into the instance):

$ rm ~/.ssh/authorized_keys

## Capture the New Image

The new image is ready for [capture](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/capture-image-resource).

Return to the Azure Console and locate the running instance in your VM instances list. On the page for the VM, click **Capture** on the upper menu. Give your image an appropriate name and select the appropriate **Resource**. You can choose to delete the VM after the image has been created. Click **Create** when done, and your image will be listed in the Resource group.

## Import the Image

The image ids generated above can be automatically added to the image registry in CycleCloud with the `cyclecloud image add` command:

  cyclecloud image add --name custom.image --label "My Image" --os windows order66 ubuntu14_rstudio

This would attempt to find images with an id or name of `order66` and `ubuntu14_rstudio` in all the cloud accounts you have configured, and save the resulting image package and artifacts. If that command succeeds, you can then use either `Image = My Image` or `ImageName = custom.image` in your cluster templates, and `My Image` will appear in the image dropdown for a cluster-creation form. The "--os" option should be specified so that the resulting package is correctly labeled as a linux or windows image.

The above command will version the package with the latest version of `custom.image` that is stored, or `1.0` if there is not currently an image package named `custom.image`. To automatically increment to the next version, include `--bump-version`:

  cyclecloud image add --name custom.image --label "My Image" --bump-version minor order66 ubuntu14_rstudio

The option to `--bump-version` can be one of `major`, `minor`, or `patch`, which will increment the first, second, or third part of the version number, respectively. You can also set the version directly with `--package-version` (for instance, `--package-version 2.0`).

If it cannot match all the images, the command will fail. To test out what it would find, include the `--dry-run` option, which prints out the same summary but does not store anything.
