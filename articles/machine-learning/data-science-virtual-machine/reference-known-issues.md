---
title: 'Reference: Known issues & troubleshooting'
titleSuffix: Azure Data Science Virtual  Machine
description: Get a list of the known issues, workarounds, and troubleshooting for Azure Data Science Virtual Machine
services: machine-learning
ms.service: data-science-vm

author: michalmar
ms.author: mimarusa
ms.topic: reference
ms.reviewer: franksolomon
ms.date: 04/29/2024
---

# Troubleshooting issues with the Azure Data Science Virtual Machine

This article explains how to find and correct errors or failures you might come across when using the Azure Data Science Virtual Machine.

## Ubuntu

### Fix GPU on NVIDIA A100 GPU Chip - Azure NDasrv4 Series

The ND A100 v4 series virtual machine is a flagship addition to the Azure GPU family. It handles high-end Deep Learning training and tightly coupled, scaled up, and scaled out HPC workloads.

Because of its unique architecture, it needs a different setup for high-demand workloads, to benefit from GPU acceleration using TensorFlow or PyTorch frameworks.

We're building out-of-the-box support for ND A100 machines GPUs. Meanwhile, your GPU can handle Ubuntu if you add the NVIDIA Fabric Manager, and update the drivers. Follow these steps at the terminal:

1. Add the NVIDIA repository to install or update drivers - find step-by-step instructions at [this resource](https://docs.nvidia.com/datacenter/tesla/tesla-installation-notes/index.html#ubuntu-lts)
1. [OPTIONAL] You can also update your CUDA drivers, from that repository
1. Install the NVIDIA Fabric Manager drivers:

    ```
    sudo apt-get install cuda-drivers-460
    sudo apt-get install cuda-drivers-fabricmanager-460
    ```

1. Reboot your VM (to prepare the drivers)
1. Enable and launch the newly installed NVIDIA Fabric Manager service:

    ```
    sudo systemctl enable nvidia-fabricmanager
    sudo systemctl start nvidia-fabricmanager
    ```

Run this code sample to verify that your GPU and your drivers work:
```
systemctl status nvidia-fabricmanager.service
```

This screenshot shows the Fabric Manager service running:

:::image type="content" source="./media/nvidia-fabricmanager-status-ok-marked.png" alt-text="Screenshot showing the Fabric Manager service running." lightbox= "./media/nvidia-fabricmanager-status-ok-marked.png":::

### Connection to desktop environment fails

If you can connect to the DSVM over SSH terminal, but you can't connect over x2go, x2go might have the wrong session type setting. To connect to the DSVM desktop environment, set the session type in *x2go/session preferences/session* to *XFCE*. Other desktop environments are currently not supported.

### Fonts look wrong when connecting to DSVM using x2go

A specific x2go session setting can cause some of the fonts look wrong when you connect to x2go. Before you connect to the DSVM, uncheck the "Set display DPI" checkbox in the "Input/Output" tab of the session preferences dialog.

### Prompted for unknown password

You can set the DSVM *Authentication type* setting to *SSH Public Key*. This is recommended, instead of password authentication. You don't receive a password if you use *SSH Public Key*. However, in some scenarios, some applications still request a password. Run `sudo passwd <user_name>` to create a new password for a specific user. With `sudo passwd`, you can create a new password for the root user.

Running this command doesn't change the SSH configuration, and permitted sign-in mechanisms remain the same.

### Prompted for password when running sudo command

When you run a `sudo` command on an Ubuntu machine, you might get a request to repeatedly enter your password to verify that you're the logged-in user. This is expected default Ubuntu behavior. However, in some situations, a repeated authentication isn't necessary and rather annoying.

To disable reauthentication for most cases, you can run this command in a terminal:

 `echo -e "\n$USER ALL=(ALL) NOPASSWD: ALL\n" | sudo tee -a /etc/sudoers`

After you restart the terminal, sudo won't ask for another sign-in and it will consider the authentication from your
session sign in as sufficient.

### Can't use docker as nonroot user

To use docker as a nonroot user, your user needs membership in the docker group. The `getent group docker` command returns a list of users that belong to that group. To add your user to the docker group, run `sudo usermod -aG docker $USER`.

### Docker containers can't interact with the outside via network

By default, Docker adds new containers to the so-called "bridge network": `172.17.0.0/16`. The subnet of
that bridge network could overlap with the subnet of your DSVM, or with another private subnet you have in your subscription. In this case, no network communication between the host and the container is possible. Additionally, web applications that run in the container can't be reached, and the container can't update packages from apt.

To fix the issue, you must reconfigure Docker to use an IP address space for its bridge network that doesn't overlap
with other networks of your subscription. For example, if you add

```json
"default-address-pools": [
        {
            "base": "10.255.248.0/21",
            "size": 21
        }
    ]
```

to the `/etc/docker/daemon.json` JSON file, Docker assigns another subnet to the bridge
network. You must edit the file with sudo, for example by running `sudo nano /etc/docker/daemon.json`.

After the change, run `service docker restart` to restart the Docker service. To determine whether or not your changes took effect, can run `docker network inspect bridge`. The value under *IPAM.Config.Subnet* should correspond to the address pool specified earlier.

### GPU(s) not available in docker container

The Docker resource installed on the DSVM supports GPUs by default. However, that support requires certain prerequisites.

* The VM size of the DSVM must include at least one GPU.
* When you start your docker container with `docker run`, you must add a *--gpus* parameter: for example, `--gpus all`.
* VM sizes that include NVIDIA A100 GPUs require other software packages installed, especially the
[NVIDIA Fabric Manager](https://docs.nvidia.com/datacenter/tesla/pdf/fabric-manager-user-guide.pdf). These packages
might not be preinstalled in your image.

## Windows

### Virtual Machine Generation 2 (Gen 2) not working
When you try to create Data Science VM based on Virtual Machine Generation 2 (Gen 2), it fails.

At this time, we maintain and provide images for Data Science Virtual Machines (DSVMs) based on Windows 2019 Server, only for Generation 1 DSVMs. [Gen 2](../../virtual-machines/generation-2.md) aren't yet supported, but we plan to support them in near future.

### Accessing SQL Server

When you try to connect to the preinstalled SQL Server instance, you might encounter a "login failed" error. To
successfully connect to the SQL Server instance, you must run the program to which you want to connect - for example, SQL Server Management Studio (SSMS) - in administrator mode. The administrator mode is required because by DSVM default behavior, only administrators can connect.

### Hyper-V doesn't work

As expected behavior, Hyper-V doesn't initially work on Windows. For best performance, we disabled some services.
To enable Hyper-V:

1. Open the search bar on your Windows DSVM
1. Type in "Services,"
1. Set all Hyper-V services to "Manual"
1. Set "Hyper-V Virtual Machine Management" to "Automatic"

Your final screen should look like this:

:::image type="content" source="./media/workaround/hyperv-enable-dsvm.png" alt-text="Screenshot showing the Hyper-V service running." lightbox= "./media/workaround/hyperv-enable-dsvm.png":::