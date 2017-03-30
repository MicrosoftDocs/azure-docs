```
#!/bin/sh

rm -rf /tmp/MobSvc

mkdir -p /tmp/MobSvc

if [ -f /etc/oracle-release ] && [ -f /etc/redhat-release ]; then
    if grep -q 'Oracle Linux Server release 6.*' /etc/oracle-release; then
        if uname -a | grep -q x86_64; then
            OS="OL6-64"
	    cp *OL6*.tar.gz /tmp/MobSvc
        fi
    fi
elif [ -f /etc/redhat-release ]; then
    if grep -q 'Red Hat Enterprise Linux Server release 6.* (Santiago)' /etc/redhat-release || \
        grep -q 'CentOS Linux release 6.* (Final)' /etc/redhat-release || \
        grep -q 'CentOS release 6.* (Final)' /etc/redhat-release; then
        if uname -a | grep -q x86_64; then
            OS="RHEL6-64"
            cp *RHEL6*.tar.gz /tmp/MobSvc
        fi
    elif grep -q 'Red Hat Enterprise Linux Server release 7.* (Maipo)' /etc/redhat-release || \
        grep -q 'CentOS Linux release 7.* (Core)' /etc/redhat-release; then
        if uname -a | grep -q x86_64; then
            OS="RHEL7-64"
            cp *RHEL7*.tar.gz /tmp/MobSvc
	fi
    fi
elif [ -f /etc/SuSE-release ] && grep -q 'VERSION = 11' /etc/SuSE-release; then
    if grep -q "SUSE Linux Enterprise Server 11" /etc/SuSE-release && grep -q 'PATCHLEVEL = 3' /etc/SuSE-release; then
        if uname -a | grep -q x86_64; then
            OS="SLES11-SP3-64"
	    echo $OS >> /tmp/MobSvc/sccm.log
	    cp *SLES11*.tar.gz /tmp/MobSvc
        fi
    fi
elif [ -f /etc/lsb-release ] ; then
    if grep -q 'DISTRIB_RELEASE=14.04' /etc/lsb-release ; then
       if uname -a | grep -q x86_64; then
           OS="UBUNTU-14.04-64"
	   cp *UBUNTU*.tar.gz /tmp/MobSvc
       fi
    fi
else
	exit 1
fi
if [ "${OS}" ==  "" ]; then
	exit 1
fi
cp MobSvc.passphrase /tmp/MobSvc
cd /tmp/MobSvc

tar -zxvf *.tar.gz


if [ -e /usr/local/.vx_version ];
then
	./install -A u
	echo "Errorcode:$?"
	Error=$?

else
	./install -t both -a host -R Agent -d /usr/local/ASR -i [CS IP] -p 443 -s y -c https -P MobSvc.passphrase >> /tmp/MobSvc/sccm.log 2>&1 && echo "Install Progress"
	Error=$?
fi
cd /tmp
rm -rf /tm/MobSvc
exit ${Error}
```