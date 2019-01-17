echo "Starting Update Script"
# Pull updated files from github
git pull

# Pull updated docker images
#docker-compose pull

# Start updated docker containers
#docker-compose up -d

echo "End Update Script"