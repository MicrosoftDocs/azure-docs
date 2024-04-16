---
title: Sample script for Azure HDInsight when cluster creation fails 
description: Sample script to run when Azure HDInsight cluster creation fails with DomainNotFound error.
ms.service: hdinsight
ms.topic: troubleshooting
ms.date: 05/25/2023
---

# Sample Script

Use this script to run when Azure HDInsight cluster creation fails with an error **DomainNotFound** error.

```
domainName=$1
userName=$2

if [[ -z "$domainName" ]]; then
    echo "Domain name is a required parameter"
    exit
fi

if [[ -z "$userName" ]]; then
    echo "User name is a required parameter"
    exit
fi

echo -n Password:
read -s password
echo

echo $password

echo "Domain join $domainName"

ping -q -c 1 $domainName 
pingStatus=$?

if [ $pingStatus -eq 0 ]; then
    echo "Ping for domain $domainName succeeded"
else
    echo "Domain controller for $domainName was not resolvable"
    exit
fi

shortDomainName="${domainName%%.*}"
shortUserName="${userName%%@*}"
sambaConfFileName="/etc/samba/smb.conf"

echo "Preparing the $sambaConfFileName file"
cp $sambaConfFileName "$sambaConfFileName.bak"
echo "[global]" > $sambaConfFileName
echo "        security = ads" >> $sambaConfFileName
echo "        realm = ${domainName^^}" >> $sambaConfFileName
echo "# If the system doesn't find the domain controller automatically, you may need the following line" >> $sambaConfFileName
echo "        password server = *" >> $sambaConfFileName
echo "# note that workgroup is the 'short' domain name" >> $sambaConfFileName
echo "        workgroup = ${shortDomainName^^}" >> $sambaConfFileName
echo "#       winbind separator = +" >> $sambaConfFileName
echo "        winbind enum users = yes" >> $sambaConfFileName
echo "        winbind enum groups = yes" >> $sambaConfFileName
echo "        template homedir = /home/%D/%U" >> $sambaConfFileName
echo "        template shell = /bin/bash" >> $sambaConfFileName
echo "        client use spnego = yes" >> $sambaConfFileName
echo "        client ntlmv2 auth = yes" >> $sambaConfFileName
echo "        encrypt passwords = yes" >> $sambaConfFileName
echo "        restrict anonymous = 2" >> $sambaConfFileName
echo "        log level = 2" >> $sambaConfFileName
echo "        log file = /var/log/samba/sambadebug.log.%m" >> $sambaConfFileName
echo "        debug timestamp = yes" >> $sambaConfFileName
echo "        max log size = 50" >> $sambaConfFileName
echo "        winbind use default domain = yes" >> $sambaConfFileName
echo "        nt pipe support = no" >> $sambaConfFileName
echo >> $sambaConfFileName
echo "# Placeholder for domains" >> $sambaConfFileName
echo "idmap config ${shortDomainName^^} : backend = rid" >> $sambaConfFileName
echo "idmap config ${shortDomainName^^} : schema_mode = rid" >> $sambaConfFileName
echo "idmap config ${shortDomainName^^} : range = 100000-1100000" >> $sambaConfFileName
echo "idmap config ${shortDomainName^^} : base_rid = 0" >> $sambaConfFileName
echo "idmap config * : backend = tdb" >> $sambaConfFileName
echo "idmap config * : schema_mode = rid" >> $sambaConfFileName
echo "idmap config * : range = 10000-99999" >> $sambaConfFileName
echo "idmap config * : base_rid = 0" >> $sambaConfFileName

export KRB5_TRACE=/tmp/krb.log
reformattedUserName="$shortUserName@${domainName^^}"
echo net ads join -w $domainName -U $reformattedUserName%$password

netJoinResult=$?

if [ $netJoinResult -ne 0 ]
then
    echo "Net join failed with result: $netJoinResult"
    exit
fi

echo "Net join succeeded"

net ads info
```
