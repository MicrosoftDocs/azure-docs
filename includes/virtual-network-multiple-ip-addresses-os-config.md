---
 title: include file
 description: include file
 services: virtual-network
 author: jimdial
 ms.service: virtual-network
 ms.topic: include
 ms.date: 05/10/2019
 ms.author: anavin
 ms.custom: include file
---

## <a name="os-config"></a>Add IP addresses to a VM operating system

Connect and sign in to a VM you created with multiple private IP addresses. You must manually add all the private IP addresses (including the primary) that you added to the VM. Complete the steps that following for your VM operating system.

### Windows

1. From a command prompt, type *ipconfig /all*.  You only see the *Primary* private IP address (through DHCP).
2. Type *ncpa.cpl* in the command prompt to open the **Network connections** window.
3. Open the properties for the appropriate adapter: **Local Area Connection**.
4. Double-click Internet Protocol version 4 (IPv4).
5. Select **Use the following IP address** and enter the following values:

	* **IP address**: Enter the *Primary* private IP address
	* **Subnet mask**: Set based on your subnet. For example, if the subnet is a /24 subnet then the subnet mask is 255.255.255.0.
	* **Default gateway**: The first IP address in the subnet. If your subnet is 10.0.0.0/24, then the gateway IP address is 10.0.0.1.
	* Select **Use the following DNS server addresses** and enter the following values:
		* **Preferred DNS server**: If you are not using your own DNS server, enter 168.63.129.16.  If you are using your own DNS server, enter the IP address for your server.
	* Select the **Advanced** button and add additional IP addresses. Add each of the secondary private IP addresses, that you added to the Azure network interface in a previous step, to the Windows network interface that is assigned the primary IP address assigned to the Azure network interface.

        You should never manually assign the public IP address assigned to an Azure virtual machine within the virtual machine's operating system. When you manually set the IP address within the operating system, ensure that it is the same address as the private IP address assigned to the Azure [network interface](../articles/virtual-network/virtual-network-network-interface-addresses.md#change-ip-address-settings), or you can lose connectivity to the virtual machine. Learn more about [private IP address](../articles/virtual-network/virtual-network-network-interface-addresses.md#private) settings. You should never assign an Azure public IP address within the operating system.

	* Click **OK** to close out the TCP/IP settings and then **OK** again to close the adapter settings. Your RDP connection is re-established.

6. From a command prompt, type *ipconfig /all*. All IP addresses you added are shown and DHCP is turned off.
7. Configure Windows to use the private IP address of the primary IP configuration in Azure as the primary IP address for Windows. See [No Internet access from Azure Windows VM that has multiple IP addresses](https://support.microsoft.com/help/4040882/no-internet-access-from-azure-windows-vm-that-has-multiple-ip-addresse) for details. 

### Validation (Windows)

To ensure you are able to connect to the internet from your secondary IP configuration via the public IP associated it, once you have added it correctly using steps above, use the following command:

```bash
ping -S 10.0.0.5 hotmail.com
```
>[!NOTE]
>For secondary IP configurations, you can only ping to the Internet if the configuration has a public IP address associated with it. For primary IP configurations, a public IP address is not required to ping to the Internet.

### Linux (Ubuntu 14/16)

We recommend looking at the latest documentation for your Linux distribution. 

1. Open a terminal window.
2. Make sure you are the root user. If you are not, enter the following command:

   ```bash
   sudo -i
   ```

3. Update the configuration file of the network interface (assuming ‘eth0’).

   * Keep the existing line item for dhcp. The primary IP address remains configured as it was previously.
   * Add a configuration for an additional static IP address with the following commands:

     ```bash
     cd /etc/network/interfaces.d/
     ls
     ```

     You should see a .cfg file.
4. Open the file. You should see the following lines at the end of the file:

   ```bash
   auto eth0
   iface eth0 inet dhcp
   ```

5. Add the following lines after the lines that exist in this file:

   ```bash
   iface eth0 inet static
   address <your private IP address here>
   netmask <your subnet mask>
   ```

6. Save the file by using the following command:

   ```bash
   :wq
   ```

7. Reset the network interface with the following command:

   ```bash
   sudo ifdown eth0 && sudo ifup eth0
   ```

   > [!IMPORTANT]
   > Run both ifdown and ifup in the same line if using a remote connection.
   >

8. Verify the IP address is added to the network interface with the following command:

   ```bash
   ip addr list eth0
   ```

   You should see the IP address you added as part of the list.

### Linux (Ubuntu 18.04+)

Ubuntu 18.04 and above have changed to `netplan` for OS network management. We recommend looking at the latest documentation for your Linux distribution. 

1. Open a terminal window.
2. Make sure you are the root user. If you are not, enter the following command:

	```bash
	sudo -i
    ```

3. Create a file for the second interface and open it in a text editor:

	```bash
	vi /etc/netplan/60-static.yaml
    ```

4. Add the following lines to the file, replacing `10.0.0.6/24` with your IP/netmask:

	```bash
    network:
        version: 2
        ethernets:
            eth0:
                addresses:
                    - 10.0.0.6/24
    ```

5. Save the file by using the following command:

	```bash
	:wq
    ```

6. Test the changes using [netplan try](http://manpages.ubuntu.com/manpages/cosmic/man8/netplan-try.8.html) to confirm syntax:

	```bash
	netplan try
    ```

> [!NOTE]
> `netplan try` will apply the changes temporarily and roll the changes back after 120 seconds. If there is a loss of connectivity, please wait 120 seconds, and then reconnect. At that time, the changes will have been rolled back.

7. Assuming no issues with `netplan try`, apply the configuration changes:

	```bash
	netplan apply
    ```

8. Verify the IP address is added to the network interface with the following command:

	```bash
	ip addr list eth0
    ```

	You should see the IP address you added as part of the list. Example:

	```bash
    1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN group default qlen 1000
        link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
        inet 127.0.0.1/8 scope host lo
        valid_lft forever preferred_lft forever
        inet6 ::1/128 scope host
        valid_lft forever preferred_lft forever
    2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP group default qlen 1000
        link/ether 00:0d:3a:8c:14:a5 brd ff:ff:ff:ff:ff:ff
        inet 10.0.0.6/24 brd 10.0.0.255 scope global eth0
        valid_lft forever preferred_lft forever
        inet 10.0.0.4/24 brd 10.0.0.255 scope global secondary eth0
        valid_lft forever preferred_lft forever
        inet6 fe80::20d:3aff:fe8c:14a5/64 scope link
        valid_lft forever preferred_lft forever
    ```
    
### Linux (Red Hat, CentOS, and others)

1. Open a terminal window.
2. Make sure you are the root user. If you are not, enter the following command:

	```bash
	sudo -i
    ```

3. Enter your password and follow instructions as prompted. Once you are the root user, navigate to the network scripts folder with the following command:

	```bash
	cd /etc/sysconfig/network-scripts
    ```

4. List the related ifcfg files using the following command:

	```bash
	ls ifcfg-*
    ```

	You should see *ifcfg-eth0* as one of the files.

5. To add an IP address, create a configuration file for it as shown below. Note that one file must be created for each IP configuration.

	```bash
	touch ifcfg-eth0:0
    ```

6. Open the *ifcfg-eth0:0* file with the following command:

	```bash
	vi ifcfg-eth0:0
    ```

7. Add content to the file, *eth0:0* in this case, with the following command. Be sure to update information based on your IP address.

	```bash
	DEVICE=eth0:0
    BOOTPROTO=static
    ONBOOT=yes
    IPADDR=192.168.101.101
    NETMASK=255.255.255.0
    ```

8. Save the file with the following command:

	```bash
	:wq
    ```

9. Restart the network services and make sure the changes are successful by running the following commands:

	```bash
	/etc/init.d/network restart
	ifconfig
    ```

	You should see the IP address you added, *eth0:0*, in the list returned.

### Validation (Linux)

To ensure you are able to connect to the internet from your secondary IP configuration via the public IP associated it, use the following command:

```bash
ping -I 10.0.0.5 hotmail.com
```
>[!NOTE]
>For secondary IP configurations, you can only ping to the Internet if the configuration has a public IP address associated with it. For primary IP configurations, a public IP address is not required to ping to the Internet.

For Linux VMs, when trying to validate outbound connectivity from a secondary NIC, you may need to add appropriate routes. There are many ways to do this. Please see appropriate documentation for your Linux distribution. The following is one method to accomplish this:

```bash
echo 150 custom >> /etc/iproute2/rt_tables 

ip rule add from 10.0.0.5 lookup custom
ip route add default via 10.0.0.1 dev eth2 table custom

```
- Be sure to replace:
	- **10.0.0.5** with the private IP address that has a public IP address associated to it
	- **10.0.0.1** to your default gateway
	- **eth2** to the name of your secondary NIC
