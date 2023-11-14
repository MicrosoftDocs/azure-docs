---
 title: include file
 description: include file
 author: dominicbetts
 ms.topic: include
 ms.date: 10/30/2023
 ms.author: dobett
ms.custom:
  - include file
  - ignite-2023
---

Azure IoT Operations should work on any CNCF-conformant kubernetes cluster. At the current time, Microsoft only supports K3s on Ubuntu Linux.

To prepare a Kubernetes cluster on Ubuntu:

1. Complete the steps in the [K3s quick-start guide](https://docs.k3s.io/quick-start).

1. Create a K3s configuration yaml file in `.kube/config`:

    ```bash
    mkdir ~/.kube
    cp ~/.kube/config ~/.kube/config.back
    sudo KUBECONFIG=~/.kube/config:/etc/rancher/k3s/k3s.yaml kubectl config view --flatten > ~/.kube/merged
    mv ~/.kube/merged ~/.kube/config
    chmod  0600 ~/.kube/config
    export KUBECONFIG=~/.kube/config
    #switch to k3s context
    kubectl config use-context default
    ```

1. Install `nfs-common` on the host machine:

    ```bash
    sudo apt install nfs-common
    ```

1. Run the following command to increase the [user watch/instance limits](https://www.suse.com/support/kb/doc/?id=000020048).

   ```bash
   echo fs.inotify.max_user_instances=8192 | sudo tee -a /etc/sysctl.conf
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```

1. For better performance, increase the file descriptor limit:

   ```bash
   echo fs.file-max = 100000 | sudo tee -a /etc/sysctl.conf

   sudo sysctl -p
   ```
