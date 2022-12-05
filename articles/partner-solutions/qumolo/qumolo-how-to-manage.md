# How to 

## Manage the Azure Native Qumulo Scalable Service 

This article describes how to manage Azure Native Qumulo Scalable File Service.

## Resource Overview

Screenshot text

The Overview page shows the details of your Qumulo file system. These details include

1.  Resource group

2.  Qumulo Core Web UI Login URL

3.  Location of the filesystem

4.  Virtual network and subnet details

5.  Subscription

6.  Marketplace Status of the service

7.  Pricing plan

8.  Storage type

Selecting the "Ip addresses" button at the bottom displays the Ip addresses associated with the filesystem which can be used to mount the file system to your workload machine.

 Screenshot text

## Accessing the Qumulo FileSystem

1.  Create a new virtual machine in the same virtual network or use an existing virtual machine in the same virtual network and login to the machine. You can use a Bastion host to login to the virtual machine based on your network policy.

Screenshot text

2.  Accessing the Admin Page

Open the Edge browser on the virtual machine and enter the Qumulo Core Web UI Login URL which is present in the resource overview into the address bar of the browser. Use username as "admin" and enter the password to login.

screenshot 

## Mounting the Qumulo File System

1.  Open the File Explorer on the virtual machine, right click on the Network drive icon and select "Map network drive"

Screenshot 

2.  From the Ip address tab of the resource overview page, select any one of the Ip addresses to enter the folder path value and append it with "\\files" and select finish.


3.  Enter the file system username and password to complete adding the network drive to your virtual machine.

Screenshot 

## Delete the Qumulo FileSystem --

To delete a deployment of Qumulo File System.

1.  From the resource menu, select your Qumulo File System

2.  Select the Overview on the left

3.  Select Delete.

4.  Confirm that you want to delete the Qumulo File System along with associated data and other resources attached to the service.

5.  Select Delete.

Screenshot 
