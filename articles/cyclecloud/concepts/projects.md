# Projects

A **project** is a collection of resources which define node configurations. Projects contain **specs**. When a node starts, it is configured by processing and running a sequence of specs.

Azure CycleCloud uses projects to manage clustered applications, such as batch schedulers. In the CycleCloud HPCPack, the project is a `hn` spec and `cn` spec which define the configurations and recipes for HPCPack headnode and computenode.

Below is a partial node definition. The docker-registry node will run three specs: bind spec from the okta project version 1.3.0, as well as core and registry specs from the docker project version 2.0.0:

```
[[node docker-registry]]
    Locker = base-storage
    [[[cluster-init okta:bind:1.3.0]]]
    [[[cluster-init docker:core:2.0.0]]]
    [[[cluster-init docker:registry:2.0.0]]]
```
The trailing tag is the project version number.

```
[[[cluster-init <project>:<spec>:<project version>]]]
```

A **locker** is a reference to a storage account container and credential. Nodes have a default locker, so this attribute is not strictly necessary.

Azure CycleCloud uses a shorthand for storage accounts, so `https://mystorage.blob.core.windows.net/mycontainer` can be written as `az://mystorage/mycontainer`.

The node will download each project it references from the locker using the [**POGO**](https://review.docs.microsoft.com/en-us/cycle/pogo-overview?branch=master) tool:

      pogo get az://mystorage/mycontainer/projects/okta/1.3.0/bind

If a project is defined on a node but does not exist in the expected storage location then the node will report a `Software Installation Failure` to CycleCloud.

CycleCloud has internal projects that run by default on all nodes to perform special volume and network handling and setup communication to CycleCloud. These internal projects are mirrored to the locker automatically.  

The user is responsible to mirroring any additional projects to the locker. The CycleCloud CLI has methods to compose projects:

      cyclecloud init myproject

and mirror:

      cyclecloud init mylocker

projects to lockers.  

Specs are made up of python, shell, or powershell scripts
