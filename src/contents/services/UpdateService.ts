import {compareVersions} from 'compare-versions';

class UpdateService {

    private isUpdateAvailable: boolean = false

    constructor() {
        this.fetchUpdate()
    }

    getUpdateAvailable() {
        return this.isUpdateAvailable;
    }

    fetchUpdate() {
        this.checkUpdateAvailable().catch(e => {
                console.log(e)
                setTimeout(()=> this.fetchUpdate(), 1000 * 30) // retry in 5 minutes
            }
        );
    }

    private async checkUpdateAvailable() {
        const currentVersion = chrome.runtime.getManifest().version
        const request = await fetch("https://api.github.com/repos/orkeilius/7speaking-bot-rework/releases/latest")
        if (!request.ok) {
            throw new Error(`Failed to fetch latest release: ${request.status} ${request.statusText}`)
        }
        const data = await request.json()
        const latestVersion: string = data.tag_name.replace("v", "")
        this.isUpdateAvailable = compareVersions(latestVersion, currentVersion) == 1
        if (this.isUpdateAvailable) {
            console.log(`🆕 Update available! Current version: ${currentVersion}, Latest version: ${latestVersion}`)
        }
    }
}


export const updateService = new UpdateService()