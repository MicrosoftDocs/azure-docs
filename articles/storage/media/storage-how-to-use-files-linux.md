Mount the file share from an Azure virtual machine running Linux

To mount the file share from a virtual machine running Linux, you may need to
install an SMB/CIFS client if the distribution you are using doesn't have a
built-in client. This is the command from Ubuntu to install one choice
cifs-utils:

Copy

sudo apt-get install cifs-utils

Next, you need to make a mount point (mkdir mymountpoint), and then issue the
mount command that is similar to this:

Copy

sudo mount -t cifs //myaccountname.file.core.windows.net/mysharename
./mymountpoint -o
vers=3.0,username=myaccountname,password=StorageAccountKeyEndingIn==,dir\_mode=0777,file\_mode=0777

\# You could now use your favorite commands to write and copy data to mounted
Azure file share.

\# cat ./mymountpoint/sample0.txt

\# cp sample1.txt ./mymountpoint

You can also add settings in your /etc/fstab to mount the share.

Note that 0777 here represent a directory/file permission code that gives
execution/read/write permissions to all users. You can replace it with other
file permission code following Linux file permission document.

Also to keep a file share mounted after reboot, you can add a setting like below
in your /etc/fstab:

Copy

//myaccountname.file.core.windows.net/mysharename /mymountpoint cifs
vers=3.0,username= myaccountname,password=
StorageAccountKeyEndingIn==,dir\_mode=0777,file\_mode=0777

For example, if you created an Azure VM using Linux image Ubuntu Server 15.04
(which is available from the Azure image gallery), you can mount the file as
below:

Copy

azureuser\@azureconubuntu:\~\$ sudo apt-get install cifs-utils

azureuser\@azureconubuntu:\~\$ sudo mkdir /mnt/mountpoint

azureuser\@azureconubuntu:\~\$ sudo mount -t cifs
//myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o
vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir\_mode=0777,file\_mode=0777

azureuser\@azureconubuntu:\~\$ df -h /mnt/mountpoint

Filesystem Size Used Avail Use% Mounted on

//myaccountname.file.core.windows.net/mysharename 5.0T 64K 5.0T 1%
/mnt/mountpoint

If you use CentOS 7.1, you can mount the file as below:+

Copy 

[azureuser\@AzureconCent \~]\$ sudo yum install samba-client samba-common
cifs-utils

[azureuser\@AzureconCent \~]\$ sudo mount -t cifs
//myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o
vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir\_mode=0777,file\_mode=0777

[azureuser\@AzureconCent \~]\$ df -h /mnt/mountpoint

Filesystem Size Used Avail Use% Mounted on

//myaccountname.file.core.windows.net/mysharename 5.0T 64K 5.0T 1%
/mnt/mountpoint

If you use Open SUSE 13.2, you can mount the file as below:+

Copy 

azureuser\@AzureconSuse:\~\> sudo zypper install samba\*

azureuser\@AzureconSuse:\~\> sudo mkdir /mnt/mountpoint

azureuser\@AzureconSuse:\~\> sudo mount -t cifs
//myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o
vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir\_mode=0777,file\_mode=0777

azureuser\@AzureconSuse:\~\> df -h /mnt/mountpoint

Filesystem Size Used Avail Use% Mounted on

//myaccountname.file.core.windows.net/mysharename 5.0T 64K 5.0T 1%
/mnt/mountpoint

If you use RHEL 7.3, you can mount the file as below:+

Copy 

azureuser\@AzureconRedhat:\~\> sudo yum install cifs-utils

azureuser\@AzureconRedhat:\~\> sudo mkdir /mnt/mountpoint

azureuser\@AzureconRedhat:\~\> sudo mount -t cifs
//myaccountname.file.core.windows.net/mysharename /mnt/mountpoint -o
vers=3.0,user=myaccountname,password=StorageAccountKeyEndingIn==,dir\_mode=0777,file\_mode=0777

azureuser\@AzureconRedhat:\~\> df -h /mnt/mountpoint

Filesystem Size Used Avail Use% Mounted on

//myaccountname.file.core.windows.net/mysharename 5.0T 64K 5.0T 1%
/mnt/mountpoint

For information on using File storage with Linux and how to mount it to
different Linux distros, like CentOS, SUSE, etc., see [How to use Azure File
Storage with
Linux](https://azure.microsoft.com/en-us/documentation/articles/storage-how-to-use-files-linux/).
