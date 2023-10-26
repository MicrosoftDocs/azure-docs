---
title: Create image for Azure Operator Nexus virtual machine
description: Create container image for Operator Nexus virtual machine
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 07/09/2023
ms.custom: template-how-to-pattern
---

# Create image for Azure Operator Nexus virtual machine

In this article, you learn how to create a container image that can be used to create a virtual machine in Operator Nexus. Specifically, you learn how to add a virtual disk to the container image. Once the container image is built and pushed to an Azure container registry, it can be used to create a virtual machine in Operator Nexus.

## Prerequisites

Before you begin creating a virtual machine (VM) image, ensure you have the following prerequisites in place:

   * Install the latest version of the [necessary Azure CLI extensions](./howto-install-cli-extensions.md).

   * This article requires version 2.49.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

   * Azure Container Registry (ACR): Set up a working Azure Container Registry to store and manage your container images. ACR provides a secure and private registry for storing Docker images used in your VM image creation process. You can create an ACR by following the official documentation at [Azure Container Registry](../container-registry/container-registry-intro.md) documentation.

   * Docker: Install Docker on your local machine. Docker is a platform that enables you to build, package, and distribute applications as lightweight containers. You use Docker to build and package your VM image. You can download Docker from Docker's [official website](https://docs.docker.com/engine/install/).

   > [!NOTE]
   > You can use the `az login` command to authenticate with Azure, and the script will automatically perform the ACR login using the provided ACR name and subscription ID. If you don't have the Azure CLI installed on your machine, you can provide your username and password for ACR login instead.

Ensure you have an operational Azure Container Registry (ACR) and Docker installed on your machine before proceeding with the creation of a VM image. Familiarize yourself with the usage and functionality of ACR and Docker, as they're essential for managing your container images and building the VM image.

## Virtual machine image requirements

   * Ensure your Virtual Network Function (VNF) image is in qcow2 format that can boot with cloud-init.

   * You need to configure the bootloader, kernel, and init system in your image to enable a text-based serial console. This configuration is required to enable console support for your virtual machine (VM). Make sure the serial port settings on your system and terminal match to establish proper communication.

   * You need to ensure your VM image supports cloud-init version 2, enabling advanced configuration options during the VM initialization process.

   * You need to ensure that your VM image includes cloud-init with the `nocloud` datasource. `nocloud` datasource allows for initial configuration and customization during VM provisioning.

   * Disks must be placed into the `/disk` directory inside the container.

   * Raw and qcow2 formats are supported. Qcow2 is recommended in order to reduce the container image's size.

   * Container disks should be based on the `scratch` image, which is an empty base image that contains no files or directories other than the image itself. Using `scratch` as the base image ensures that the container image is as small as possible and only includes the necessary files for the VNF.


## Steps to create image for Operator Nexus virtual machine

You can create an image for your VNF by using the provided script. It generates a Dockerfile that copies the VNF  disk image file into the container's `/disk` directory.

> [!NOTE]
> The following script is provided as an example. If you prefer, you can create and push the container image manually instead of following the script.

The following environment variables are used to configure the script for creating a virtual machine (VM) image for your VNF. Modify and export these variables with your own values before executing the script:

```bash

# Azure subscription ID (provide if not using username-password)
export SUBSCRIPTION="your_subscription_id"

# (Mandatory) Azure Container Registry name
export ACR_NAME="your_acr_name"

# (Mandatory) Name of the container image
export CONTAINER_IMAGE_NAME="your_container_image_name"

# (Mandatory) Tag for the container image
export CONTAINER_IMAGE_TAG="your_container_image_tag"

# (Mandatory) VNF image (URL, local file, or full local path)
export VNF_IMAGE="your_vnf_image"

# (Optional) ACR URL (leave empty to derive from ACR_NAME)
export ACR_URL=""

# (Optional) ACR login username (provide if not using subscription)
export USERNAME=""

# (Optional) ACR login password (provide if not using subscription)
export PASSWORD=""
```

To create a VM image for your Virtual Network Function (VNF), save the provided script as `create-container-disk.sh`, set the required environment variables, and execute the script.

```bash
#!/bin/bash

# Define the required environment variables
required_vars=(
    "ACR_NAME"                  # Azure Container Registry name
    "CONTAINER_IMAGE_NAME"      # Name of the container image
    "CONTAINER_IMAGE_TAG"       # Tag for the container image
    "VNF_IMAGE"                 # VNF image (URL or file path)
)

# Verify if required environment variables are set
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "Error: $var environment variable is not set."
        exit 1
    fi
done

# Check if either SUBSCRIPTION or USERNAME with PASSWORD is provided
if [ -z "$SUBSCRIPTION" ] && [ -z "$USERNAME" ] && [ -z "$PASSWORD" ]; then
    echo "Error: Either provide SUBSCRIPTION or USERNAME with PASSWORD."
    exit 1
fi

# Set default value for DOCKERFILE_NAME if not set
if [ -z "$DOCKERFILE_NAME" ]; then
    DOCKERFILE_NAME="nexus-vm-img-dockerfile"
fi

# Check if ACR_URL is already set by the user
if [ -z "$ACR_URL" ]; then
    # Derive the ACR URL from the ACR_NAME
    ACR_URL="$ACR_NAME.azurecr.io"
fi

# Initialize variables for downloaded/copied files
downloaded_files=()

# Function to clean up downloaded files
cleanup() {
    for file in "${downloaded_files[@]}"; do
        if [ -f "$file" ]; then
            rm "$file"
        fi
    done
}

# Register the cleanup function to be called on exit
trap cleanup EXIT

# Check if the VNF image is a URL or a local file
if [[ "$VNF_IMAGE" == http* ]]; then
    # Use curl to download the file
    filename=$(basename "$VNF_IMAGE")
    # Download the VNF image file and save the output to a file
    curl -f -Lo "$filename" "$VNF_IMAGE"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to download file."
        exit 1
    fi
    # Add the downloaded file to the list for cleanup
    downloaded_files+=("$filename")
elif [[ "$VNF_IMAGE" == /* ]]; then
    # Use the provided full local path
    filename=$(basename "$VNF_IMAGE")
    # Copy the VNF image file to the current directory for cleanup
    cp "$VNF_IMAGE" "./$filename"
    # Add the copied file to the list for cleanup
    downloaded_files+=("$filename")
else
    # Assume it's a local file in the current directory
    filename="$VNF_IMAGE"
fi

# Check if the file exists
if [ ! -f "$filename" ]; then
    echo "Error: File $filename does not exist."
    exit 1
fi

# Create a Dockerfile that copies the VNF image file into the container's /disk directory
# The containerDisk needs to be readable for the user with the UID 107 (qemu).
cat <<EOF > "$DOCKERFILE_NAME"
FROM scratch
ADD --chown=107:107 "$filename" /disk/
EOF

# Build the Docker image and tag it to the Azure Container Registry
docker build -f "$DOCKERFILE_NAME" -t "$CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_TAG" .

# Log in to Azure Container Registry
if [ -n "$USERNAME" ] && [ -n "$PASSWORD" ]; then
    docker login "$ACR_NAME.azurecr.io" -u "$USERNAME" -p "$PASSWORD"
else
    az acr login --name "$ACR_NAME" --subscription "$SUBSCRIPTION"
fi

docker tag "$CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_TAG" "$ACR_URL/$CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_TAG"
docker push "$ACR_URL/$CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_TAG"

# Remove the downloaded/copied files
cleanup

rm "$DOCKERFILE_NAME"

echo "VNF image $ACR_URL/$CONTAINER_IMAGE_NAME:$CONTAINER_IMAGE_TAG created successfully!"

```

After executing the script, you'll have a VM image tailored for your Virtual Network Function (VNF). You can use this image to deploy your VNF.

## Example usage

1. Set the required environment variables.

    ```bash
    export SUBSCRIPTION=""00000000-0000-0000-0000-000000000000""
    export ACR_NAME="myvnfacr"
    export CONTAINER_IMAGE_NAME="ubuntu"
    export CONTAINER_IMAGE_TAG="20.04"
    export VNF_IMAGE="https://cloud-images.ubuntu.com/releases/focal/release/ubuntu-20.04-server-cloudimg-amd64.img"
    ```
2. Save the provided script as `create-container-disk.sh` and make it executable.

    ```bash
    chmod +x create-container-disk.sh
    ```
3. Execute the script.
    ```bash
    $ ./create-container-disk.sh
      % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                     Dload  Upload   Total   Spent    Left  Speed
    100  622M  100  622M    0     0  24.7M      0  0:00:25  0:00:25 --:--:-- 26.5M
    [+] Building 36.6s (5/5) FINISHED
     => [internal] load .dockerignore                                                              0.1s
     => => transferring context: 2B                                                                0.0s
     => [internal] load build definition from nexus-vm-img-dockerfile                              0.1s
     => => transferring dockerfile: 137B                                                           0.0s
     => [internal] load build context                                                              36.4s
     => => transferring context: 652.33MB                                                          36.3s
     => CACHED [1/1] ADD --chown=107:107 ubuntu-20.04-server-cloudimg-amd64.img /disk/             0.0s
     => exporting to image                                                                         0.0s
     => => exporting layers                                                                        0.0s
     => => writing image sha256:5b5f531c132cdbba202136b5ec41c9bfe9d91beeb5acee617c1ef902df4ca772   0.0s
     => => naming to docker.io/library/ubuntu:20.04                                                0.0s
    Login Succeeded
    The push refers to repository [myvnfacr.azurecr.io/ubuntu]
    b86efae7de58: Layer already exists
    20.04: digest: sha256:d514547ee28d9ed252167d0943d4e711547fda95161a3728c44a275f5d9669a8 size: 529
    VNF image myvnfacr.azurecr.io/ubuntu:20.04 created successfully!
    ```

## Next steps

 Refer to the [QuickStart guide](./quickstarts-virtual-machine-deployment-cli.md) to deploy a VNF using the image you created.

<!-- LINKS - internal -->
[kubernetes-concepts]: ../../../aks/concepts-clusters-workloads.md
[az-account]: /cli/azure/account
[az-group-create]: /cli/azure/group#az-group-create
[az-group-delete]: /cli/azure/group#az-group-delete
[azure-resource-group]: ../../../azure-resource-manager/management/overview.md
