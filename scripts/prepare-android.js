const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

function runCommand(command) {
  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  try {
    // 1. Ensure android platform is added
    const androidDir = path.join(__dirname, '..', 'android');
    if (!fs.existsSync(androidDir)) {
      console.log('Android folder not found. Adding platform...');
      runCommand('npx cap add android');
    } else {
      console.log('Android folder already exists.');
    }

    const resDir = path.join(androidDir, 'app', 'src', 'main', 'res');

    // 2. Configure App Name in strings.xml
    const stringsPath = path.join(resDir, 'values', 'strings.xml');
    if (fs.existsSync(stringsPath)) {
      console.log('Configuring app name in strings.xml...');
      let stringsContent = fs.readFileSync(stringsPath, 'utf8');
      
      // Replace app_name and title_activity_main value
      stringsContent = stringsContent.replace(
        /<string name="app_name">[^<]*<\/string>/g,
        '<string name="app_name">Kalkulyator</string>'
      );
      stringsContent = stringsContent.replace(
        /<string name="title_activity_main">[^<]*<\/string>/g,
        '<string name="title_activity_main">Kalkulyator</string>'
      );
      
      fs.writeFileSync(stringsPath, stringsContent, 'utf8');
      console.log('App name configured successfully.');
    } else {
      console.warn('strings.xml not found at:', stringsPath);
    }

    // 3. Download and configure launcher icons
    console.log('Downloading custom app icon...');
    const iconUrl = 'https://lh5.ggpht.com/XJIPVm71Icy7mlESQeMie6XY2PEG7p2YE3hERXBu2ZLI78cGjWSjsUp-q0aUiQ4QrUg=w300';
    const tempIconPath = path.join(__dirname, '..', 'custom_icon.png');
    
    await downloadFile(iconUrl, tempIconPath);
    console.log('Icon downloaded.');

    const densities = ['hdpi', 'mdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi'];
    for (const density of densities) {
      const mipmapDir = path.join(resDir, `mipmap-${density}`);
      if (!fs.existsSync(mipmapDir)) {
        fs.mkdirSync(mipmapDir, { recursive: true });
      }
      
      fs.copyFileSync(tempIconPath, path.join(mipmapDir, 'ic_launcher.png'));
      fs.copyFileSync(tempIconPath, path.join(mipmapDir, 'ic_launcher_round.png'));
    }
    console.log('Icons copied to mipmap folders.');

    // 4. Force PNG icon usage by deleting adaptive XML files if they exist
    const anyDpiDir = path.join(resDir, 'mipmap-anydpi-v26');
    const adaptiveIcon = path.join(anyDpiDir, 'ic_launcher.xml');
    const adaptiveIconRound = path.join(anyDpiDir, 'ic_launcher_round.xml');

    if (fs.existsSync(adaptiveIcon)) {
      fs.unlinkSync(adaptiveIcon);
      console.log('Removed adaptive ic_launcher.xml');
    }
    if (fs.existsSync(adaptiveIconRound)) {
      fs.unlinkSync(adaptiveIconRound);
      console.log('Removed adaptive ic_launcher_round.xml');
    }

    // Clean up temp icon
    if (fs.existsSync(tempIconPath)) {
      fs.unlinkSync(tempIconPath);
    }

    console.log('All android customizations applied successfully!');
  } catch (error) {
    console.error('Error during prepare-android:', error);
    process.exit(1);
  }
}

main();
