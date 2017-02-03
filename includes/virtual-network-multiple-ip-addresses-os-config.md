## <a name="os-config"></a>Add IP addresses to a VM operating system

Connect and login to a VM you created with multiple private IP addresses. You must manually add all the private IP addresses (including the primary) that you added to the VM. Complete the following steps for your VM operating system:

### Windows

1. From a command prompt, type *ipconfig /all*.  You only see the *Primary* private IP address (through DHCP).
2. Type *ncpa.cpl* in the command prompt to open the **Network connections** window.
3. Open the properties for **Local Area Connection**.
4. Double-click Internet Protocol version 4 (IPv4).
5. Select **Use the following IP address** and enter the following values:

	* **IP address**: Enter the *Primary* private IP address
	* **Subnet mask**: Set based on your subnet. For example, if the subnet is a /24 subnet then the subnet mask is 255.255.255.0.
	* **Default gateway**: The first IP address in the subnet. If your subnet is 10.0.0.0/24, then the gateway IP address is 10.0.0.1.
	* Click **Use the following DNS server addresses** and enter the following values:
		* **Preferred DNS server**: If you are not using your own DNS server, enter 168.63.129.16.  If you are using your own DNS server, enter the IP address for your server.
	* Click the **Advanced** button and add additional IP addresses. Add each of the secondary private IP addresses listed in step 8 to the NIC with the same subnet specified for the primary IP address.
	* Click **OK** to close out the TCP/IP settings and then **OK** again to close the adapter settings. Your RDP connection is re-established.
6. From a command prompt, type *ipconfig /all*. All IP addresses you added are shown and DHCP is turned off.
	
### Linux (Ubuntu)

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
4. Open the file:

		```bash
		vi eth0.cfg
		```

	You should see the following lines at the end of the file:

	```bash
	auto eth0
	iface eth0 inet dhcp
	```

5. Add the following lines after the lines that exist in this file:

	```bash
	iface eth0 inet static
	address <your private IP address here>
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
	Ip addr list eth0
	```

	You should see the IP address you added as part of the list.
	
### Linux (Redhat, CentOS, and others)

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
