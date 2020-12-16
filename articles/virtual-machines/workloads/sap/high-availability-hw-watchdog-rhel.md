# SAP HANA High Availability configuration on Rhel
This document provides instructions using which you can configure HA on SAP Hana systems with Hardware watchdog enabled on Rhel OS


## Prerequisites
Unload the wrong driver from the environment
:node1:~ # modprobe -r iTCO_wdt iTCO_vendor_support
To make sure the driver is not loaded during the next system boot the driver must be blacklisted.To Blacklist the iTCO modules. Add end off the file:
node1:~ # vi /etc/modprobe.d/blacklist.conf...# unload the iTCO watchdog modulesblacklist iTCO_wdtblacklist iTCO_vendor_support

## Install and configure the right supported watchdog
Install and configure the IPMI watchdog
node1:~ # yum install OpenIPMI.x86_64
node1:~ # mv /etc/sysconfig/ipmi /etc/sysconfig/ipmi.org
node1:~ # vi /etc/sysconfig/ipmi
IPMI_SI=yesDEV_IPMI=yes
IPMI_WATCHDOG=yes
IPMI_WATCHDOG_OPTIONS="timeout=20 action=reset nowayout=0 
panic_wdt_timeout=15"IPMI_POWEROFF=no
IPMI_POWERCYCLE=no
IPMI_IMB=no
node1:~# systemctl enable ipmi
node1:~ # systemctl start ipmi
After the ipmi_watchdog was started
node1:~ # lsmod |grep ipmi
ipmi_watchdog          24912  1
ipmi_devintf           17572  0
ipmi_si                57482  1
ipmi_msghandler        49676  3 
ipmi_devintf,ipmi_watchdog,ipmi_si

Install and configure the linux watchdog
node1:~ # yum install watchdog
node1:~ # vi /etc/watchdog.conf
watchdog-device = /dev/watchdog
watchdog-timeout = 240interval = 10

node1:~ # systemctlenable watchdog
node1:~ # systemctl start watchdog
node1:~ # ipmitool mc watchdog get
Watchdog Timer Use:     SMS/OS (0x44)
Watchdog Timer Is:      Started/Running
Watchdog Timer Actions: Hard Reset (0x01)
Pre-timeout interval:   0 seconds
Timer Expiration Flags: 0x10
Initial Countdown:      240sec
Present Countdown:      239 sec

Test the watchdog configurationTrigger the Kernel Crash
node1:~ # echo c > /proc/sysrq-trigger
System must reboot after 5 Minutes (BMC timeout) or the value which is set as panic_wdt_timeout in the /etc/sysconfig/ipmi config file.Configure SBD

