---
title: How to setup SMT server for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: How to setup SMT server for SAP HANA on Azure (Large Instance).
services: virtual-machines-linux
documentationcenter: 
author: hermanndms
manager: jeconnoc
editor:

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 09/10/2018
ms.author: rclaus
ms.custom: H1Hack27Feb2017

---
# Setting up SMT server for SUSE Linux
SAP HANA Large Instances don't have direct connectivity to the Internet. Hence it is not a straightforward process to register such a unit with the OS provider and to download and apply patches. If SUSE Linux, one solution could be to set up an SMT server in an Azure VM. Whereas the Azure VM needs to be hosted in an Azure VNet, which is connected to the HANA Large Instance. With such an SMT server, the HANA Large Instance unit could register and download patches. 

SUSE provides a larger guide on their [Subscription Management Tool for SLES 12 SP2](https://www.suse.com/documentation/sles-12/pdfdoc/book_smt/book_smt.pdf). 

As precondition for the installation of an SMT server that fulfills the task for HANA Large Instance, you would need:

- An Azure VNet that is connected to the HANA Large Instance ER circuit.
- A SUSE account that is associated with an organization. Whereas the organization would need to have some valid SUSE subscription.

## Installation of SMT server on Azure VM

In this step, you install the SMT server in an Azure VM. The first measure is to sign in to the [SUSE Customer Center](https://scc.suse.com/).

As you are logged in, go to Organization--> Organization Credentials. In that section you should find the credentials that are necessary to set up the SMT server.

The third step is to install a SUSE Linux VM in the Azure VNet. To deploy the VM, take a SLES 12 SP2 gallery image of Azure (select BYOS SUSE image). In the deployment process, don't define a DNS name and do not use static IP addresses as seen in this screenshot

![vm deployment for SMT server](./media/hana-installation/image3_vm_deployment.png)

The deployed VM was a smaller VM and got the internal IP address in the Azure VNet of 10.34.1.4. Name of the VM was smtserver. After the installation, the connectivity to the HANA Large instance unit(s) was checked. Dependent on how you organized name resolution you might need to configure resolution of the HANA Large Instance units in etc/hosts of the Azure VM. 
Add an additional disk to the VM that is going to be used to hold the patches. The boot disk itself could be too small. In the case demonstrated, the disk got mounted to /srv/www/htdocs as shown in the following screenshot. A 100-GB disk should suffice.

![vm deployment for SMT server](./media/hana-installation/image4_additional_disk_on_smtserver.PNG)

Sign in to the HANA Large Instance unit(s), maintain /etc/hosts and check whether you can reach the Azure VM that is supposed to run the SMT server over the network.

After this check is done successfully, you need to sign in to the Azure VM that should run the SMT server. If you are using putty to sign in to the VM, you need to execute this sequence of commands in your bash window:

```
cd ~
echo "export NCURSES_NO_UTF8_ACS=1" >> .bashrc
```

After executing these commands, restart your bash to activate the settings. Then start YAST.

Connect your VM (smtserver) to the SUSE site.

```
smtserver:~ # SUSEConnect -r <registration code> -e s<email address> --url https://scc.suse.com
Registered SLES_SAP 12.2 x86_64
To server: https://scc.suse.com
Using E-Mail: email address
Successfully registered system.
```

Once the VM is connected to the SUSE site, install the smt packages. Use the following putty command to install the smt packages.

```
smtserver:~ # zypper in smt
Refreshing service 'SUSE_Linux_Enterprise_Server_for_SAP_Applications_12_SP2_x86_64'.
Loading repository data...
Reading installed packages...
Resolving package dependencies...
```


You can also use YAST tool to install the smt packages. In YAST, go to Software Maintenance and search for smt. Select smt, which switches automatically to yast2-smt as shown below

![SMT in yast](./media/hana-installation/image5_smt_in_yast.PNG)


Accept the selection for installation on the smtserver. Once installed, go to the SMT server configuration and enter the organizational credentials from the SUSE Customer Center you retrieved earlier. Also enter your Azure VM hostname as the SMT Server URL. In this demonstration, it was https://smtserver as displayed in the next graphics.

![Configuration of SMT server](./media/hana-installation/image6_configuration_of_smtserver1.png)

As next step, you need to test whether the connection to the SUSE Customer Center works. As you see in the following graphics, in the demonstration case, it did work.

![Test connect to SUSE Customer Center](./media/hana-installation/image7_test_connect.png)

Once the SMT setup starts, you need to provide a database password. Since it is a new installation, you need to define that password as shown in the next graphics.

![Define password for database](./media/hana-installation/image8_define_db_passwd.PNG)

The next interaction you have is when a certificate gets created. Go through the dialog as shown next and the step should proceed.

![Create certificate for SMT server](./media/hana-installation/image9_certificate_creation.PNG)

There might be some minutes spent in the step of 'Run synchronization check' at the end of the configuration. After the installation and configuration of the SMT server, you should find the directory repo under the mount point /srv/www/htdocs/ plus some subdirectories under repo. 

Restart the SMT server and its related services with these commands.

```
rcsmt restart
systemctl restart smt.service
systemctl restart apache2
```

## Download of packages onto SMT server

After all the services are restarted, select the appropriate packages in SMT Management using Yast. The package selection depends on the OS image of the HANA Large Instance  server and not on the SLES release or version of the VM running the SMT server. An example of the selection screen is shown below.

![Select Packages](./media/hana-installation/image10_select_packages.PNG)

Once you are finished with the package selection, you need to start the initial copy of the select packages to the SMT server you set up. This copy is triggered in the shell using the command smt-mirror as shown below


![Download packages to SMT server](./media/hana-installation/image11_download_packages.PNG)

As you see above, the packages should get copied into the directories created under the mount point /srv/www/htdocs. This process can take a while. Dependent on how many packages you select, it could take up to one hour or more.
As this process finishes, you need to move to the SMT client setup. 

## Set up the SMT client on HANA Large Instance units

The client(s) in this case are the HANA Large Instance units. The SMT server setup copied the script clientSetup4SMT.sh into the Azure VM. Copy that script over to the HANA Large Instance unit you want to connect to your SMT server. Start the script with the -h option and give it as parameter the name of your SMT server. In this example smtserver.

![Configure SMT client](./media/hana-installation/image12_configure_client.PNG)

There might be a scenario where the load of the certificate from the server by the client succeeded, but the registration failed as shown below.

![Registration of client fails](./media/hana-installation/image13_registration_failed.PNG)

If the registration failed, read this [SUSE support document](https://www.suse.com/de-de/support/kb/doc/?id=7006024) and execute the steps described there.

> [!IMPORTANT] 
> As server name you need to provide the name of the VM, in this case smtserver, without the fully qualified domain name. Just the VM name works. 

After these steps have been executed, you need to execute the following command on the HANA Large Instance unit

```
SUSEConnect –cleanup
```

> [!Note] 
> In our tests we always had to wait a few minutes after that step. The immediate execution clientSetup4SMT.sh, after the corrective measures described in the SUSE article, ended with messages that the certificate would not be valid yet. Waiting for 5-10 minutes usually and executing clientSetup4SMT.sh ended in a successful client configuration.

If you ran into the issue that you needed to fix based on the steps of the SUSE article, you need to restart clientSetup4SMT.sh on the HANA Large Instance unit again. Now it should finish successfully as shown below.

![Client registration succeeded](./media/hana-installation/image14_finish_client_config.PNG)

With this step, you configured the SMT client of the HANA Large Instance unit to connect against the SMT server you installed in the Azure VM. You now can take 'zypper up' or 'zypper in' to install OS patches to HANA Large Instances or install additional packages. It is understood that you only can get patches that you downloaded before on the SMT server.

**Next steps**
- Refer [HANA Installation on HLI](hana-example-installation.md).











