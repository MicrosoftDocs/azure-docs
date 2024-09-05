---
ms.service: azure-arc
ms.topic: include
ms.date: 08/30/2024
author: sethmanheim
ms.author: sethm
---

Then, perform the following steps in your Kubernetes cluster:

> [!IMPORTANT]
> You must complete the following steps for each node in your Kubernetes cluster.

1. Run the following command to determine if you set `fs.inotify.max_user_instances` to 1024:

   ```bash
   sysctl fs.inotify.max_user_instances
   ```

   After you run this command, if it outputs less than 1024, run the following command to increase the maximum number of files and reload the **sysctl** settings:

   ```bash
   echo 'fs.inotify.max_user_instances = 1024' | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

1. Install the required NVME over TCP module for your kernel using:

   ```bash
   sudo apt install linux-modules-extra-`uname -r`
   ```

   > [!NOTE]
   > The minimum supported version is 5.1. At this time, there are known issues with 6.4 and 6.2.

1. Set the number of **HugePages** to 512 using the following command:

   ```bash
   HUGEPAGES_NR=512
   echo $HUGEPAGES_NR | sudo tee /sys/devices/system/node/node0/hugepages/hugepages-2048kB/nr_hugepages
   echo "vm.nr_hugepages=$HUGEPAGES_NR" | sudo tee /etc/sysctl.d/99-hugepages.conf
   ```

1. Restart K3s using the following command:

   ```bash
   sudo systemctl restart k3s || sudo systemctl restart k3s-agent
   ```
