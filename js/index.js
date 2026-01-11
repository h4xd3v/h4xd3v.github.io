/**
 * SSOFT-H4X WebTools
 * Refactored for performance and scalability.
 */

const WebTools = {
    init: () => {
        WebTools.addEventListeners();
    },

    addEventListeners: () => {
        // Navigation Toggle
        const navToggle = document.getElementById('navToggle');
        const navList = document.querySelector('.nav-list');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navList.classList.toggle('active');
            });
        }

        // Tool 1: Obfuscate
        const txtAreaOfuscate = document.getElementById('txtAreaOfuscate');
        if (txtAreaOfuscate) {
            txtAreaOfuscate.addEventListener('keyup', (e) => {
                WebTools.obfuscateIOC(e.target.value);
            });
        }

        // Tool 2: Deobfuscate
        const txtAreaIOCClarify = document.getElementById('txtAreaIOCClarify');
        if (txtAreaIOCClarify) {
            txtAreaIOCClarify.addEventListener('keyup', (e) => {
                WebTools.deobfuscateIOC(e.target.value);
            });
        }

        // Tool 3: Filter
        const txtWordFilter = document.getElementById('txtWordFilter');
        const txtTextFilter = document.getElementById('txtTextFilter');

        const runFilter = () => {
            WebTools.filterContent(txtTextFilter.value, txtWordFilter.value);
        };

        if (txtWordFilter) txtWordFilter.addEventListener('keyup', runFilter);
        if (txtTextFilter) txtTextFilter.addEventListener('keyup', runFilter); // Also filter when dump changes
    },

    /* Logic */

    obfuscateIOC: (input) => {
        const output = input
            .replaceAll(".", "[.]")
            .replaceAll(":", "[:]")
            .replaceAll("http", "hxxp")
            .replaceAll(/^\s*\n/gm, ""); // Remove empty lines at start? maintained original logic

        document.getElementById('txtAreaCustomIOCOfuscate').value = output;
    },

    deobfuscateIOC: (input) => {
        const output = input
            .replaceAll("[.]", ".")
            .replaceAll("[:]", ":")
            .replaceAll("hxxp", "http")
            .replaceAll(/^\s*\n/gm, "");

        document.getElementById('txtAreaCustomIOCClarify').value = output;
    },

    filterContent: (text, keyword) => {
        if (!text) {
            // Clear outputs if empty
            ['txtMD5ResultFilterText', 'txtSHA256ResultFilterText', 'txtDomainResultFilterText', 'txtURLResultFilterText', 'txtResultFilterText'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.value = '';
            });
            ['countMD5', 'countSHA256', 'countDomain', 'countURL', 'countCustom'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.textContent = '0';
            });
            return;
        }

        // Regex Patterns
        // Hashes
        const msgRegex = /\b[a-fA-F0-9]{32}\b/g;
        const sha256Regex = /\b[a-fA-F0-9]{64}\b/g;

        // Domains: Alphanumeric + dots/hyphens. Handles defanged [.]
        const domainRegex = /\b([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.|\[\.\]))+[a-zA-Z]{2,6}\b/g;

        // URLs: http/https/hxxp + :// + domain + path
        const urlRegex = /h(?:tt|xx)p(?:s)?(?:\[:\]|:)\/\/(?:[\w.-]+|\[\.\])(?:[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]|\[\.\])+/gi;

        // Extraction Helper
        const extract = (regex) => {
            const matches = text.match(regex) || [];
            return [...new Set(matches)]; // Unique
        };

        const uniqueMD5 = extract(msgRegex);
        const uniqueSHA256 = extract(sha256Regex);
        const uniqueURLs = extract(urlRegex);
        const uniqueDomains = extract(domainRegex);

        // Custom Filter (Line-based search)
        const lines = text.split('\n').map(l => l.trim()).filter(l => l);
        let customMatches = [];
        if (keyword) {
            customMatches = lines.filter(line => line.toLowerCase().includes(keyword.toLowerCase()));
        }

        // Update UI
        const updateUI = (textAreaId, countId, data) => {
            const elParams = document.getElementById(textAreaId);
            const elCount = document.getElementById(countId);
            if (elParams) elParams.value = data.join("\n");
            if (elCount) elCount.textContent = data.length;
        };

        updateUI('txtMD5ResultFilterText', 'countMD5', uniqueMD5);
        updateUI('txtSHA256ResultFilterText', 'countSHA256', uniqueSHA256);
        updateUI('txtDomainResultFilterText', 'countDomain', uniqueDomains);
        updateUI('txtURLResultFilterText', 'countURL', uniqueURLs);
        updateUI('txtResultFilterText', 'countCustom', customMatches);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', WebTools.init);