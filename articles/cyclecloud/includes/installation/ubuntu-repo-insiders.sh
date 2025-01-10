echo "deb [signed-by=/etc/apt/keyrings/microsoft.gpg] https://packages.microsoft.com/repos/cyclecloud-insiders stable main" |
  sudo tee /etc/apt/sources.list.d/cyclecloud.list > /dev/null
sudo apt-get -qq update 