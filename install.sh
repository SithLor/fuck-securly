
# ./maigret.py username

# web-check yarn serve

# usage docker run -it --name photon photon:latest -u google.com

#usage cd spiderfoot-4.0
#usage pip3 install -r requirements.txt
#usage python3 ./sf.py -l 127.0.0.1:5001

#subfinder
go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest
#spider foot
wget https://github.com/smicallef/spiderfoot/archive/v4.0.tar.gz
tar zxvf v4.0.tar.gz

#Photon
git clone https://github.com/s0md3v/Photon.git
cd Photon
docker build -t photon .
cd ..

#maigret
git clone https://github.com/soxoj/maigret && cd maigret
pip3 install -r requirements.txt
cd ..


#web-check
sudo apt install chromium-bsu dnsutils
git clone https://github.com/Lissy93/web-check.git  # Download the code from GitHub
cd web-check                                        # Navigate into the project dir
yarn install                                        # Install the NPM dependencies
yarn build                                          # Build the app for production
cd ..

#social-analyzer
sudo apt-get update
#Depedning on your Linux distro, you may or may not need these 2 lines
sudo DEBIAN_FRONTEND=noninteractive apt-get install -y software-properties-common
sudo add-apt-repository ppa:mozillateam/ppa -y
sudo apt-get install -y firefox-esr tesseract-ocr git nodejs npm
git clone https://github.com/qeeqbox/social-analyzer.git
cd social-analyzer
npm update
npm install
npm install loadash
cd ..