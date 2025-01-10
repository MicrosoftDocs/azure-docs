cat | sudo tee /etc/yum.repos.d/cyclecloud.repo > /dev/null <<EOF
[cyclecloud]
name=cyclecloud
baseurl=https://packages.microsoft.com/yumrepos/cyclecloud-insiders
gpgcheck=1
gpgkey=https://packages.microsoft.com/keys/microsoft.asc
EOF