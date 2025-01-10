sudo apt-get -qq update && sudo apt-get -y -qq install curl gnupg2
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc |
  gpg --dearmor | sudo tee /etc/apt/keyrings/microsoft.gpg > /dev/null
sudo chmod go+r /etc/apt/keyrings/microsoft.gpg
