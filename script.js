// Ensure proper sizing on all devices
function adjustLayout() {
    const container = document.getElementById('bgContainer');

    if (window.innerWidth <= 768) {
        // Mobile: use viewport height
        container.style.minHeight = '100vh';
        container.style.height = '100vh';
    } else {
        // Desktop: calculate based on image aspect ratio
        const img = new Image();
        img.src = 'flower.jpg';
        img.onload = function() {
            const aspectRatio = img.height / img.width;
            const containerWidth = window.innerWidth;
            const containerHeight = containerWidth * aspectRatio;
            container.style.height = containerHeight + 'px';
            container.style.minHeight = containerHeight + 'px';
        };
    }
}

// Call on load and resize
window.addEventListener('load', adjustLayout);
window.addEventListener('resize', adjustLayout);

// Flower descriptions
const flowerData = {
    rose: {
        name: "白風信子",
        description: "花語：純潔的愛、思念與祝福。\n一朵朵細小的白花，帶著溫柔的香氣，\n像遠方寄來的問候，靜靜傳遞心意。"
    },
    lily: {
        name: "淺紫翠珠",
        description: "花語：守護與柔情。\n細小的花密集成簇，\n象徵家的聯繫與不離不棄的陪伴。"
    },
    tulip: {
        name: "白松蟲花",
        description: "花語：細膩的愛與體貼的思念。\n柔軟的花心像一顆溫暖的心，\n靜靜守護著家，也守護著想念。"
    },
    peony: {
        name: "雪柳",
        description: "花語：思念與祝福。\n纖細的枝條開滿白花，\n象徵潔淨的情感與新一年的希望。"
    },
    orchid: {
        name: "白洋牡丹",
        description: "花語：光彩奪目的美麗。\n層層疊疊的花瓣，是歲月與溫柔的形狀，\n像媽媽的笑容，永遠溫暖明亮。"
    },
    sunflower: {
        name: "淡藍小飛燕",
        description: "花語：希望與開闊。\n藍色的花莖筆直挺立，\n如同祝願——願日子平靜、心情寬闊。"
    },
    hydrangea: {
        name: "白風鈴桔梗",
        description: "花語：溫柔的祝福、誠摯的心意。\n鈴鐺形花朵在光下微微顫動，\n像一聲輕響的「謝謝你」，\n說著孩子永遠的感激。"
    },
    daisy: {
        name: "噴泉草",
        description: "花語：柔軟與自由。\n輕盈的穗隨風搖曳，\n像時光裡不變的溫柔節奏。"
    }
};

// Edit Mode Variables
let editMode = false;
let draggedElement = null;
let offsetX = 0;
let offsetY = 0;

// Get modal elements
const modal = document.getElementById('flowerModal');
const flowerName = document.getElementById('flowerName');
const flowerDescription = document.getElementById('flowerDescription');
const closeBtn = document.querySelector('.close-btn');

// Get all flower buttons
const flowerButtons = document.querySelectorAll('.flower-btn');

// Add click event to each flower button
flowerButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        const flowerType = this.getAttribute('data-flower');
        const flower = flowerData[flowerType];

        if (editMode) {
            // In edit mode: open edit modal
            openEditModal(button, flowerType, flower);
        } else {
            // Normal mode: show description
            if (flower) {
                flowerName.textContent = flower.name;
                flowerDescription.textContent = flower.description;
                modal.style.display = 'block';
            }
        }
    });
});

// Close modal when clicking the X button
closeBtn.addEventListener('click', function() {
    modal.style.display = 'none';
});

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && modal.style.display === 'block') {
        modal.style.display = 'none';
    }
});

// ============ EDIT MODE & DRAG FUNCTIONALITY ============

const toggleEditBtn = document.getElementById('toggleEditMode');
const exportBtn = document.getElementById('exportPositions');
const container = document.querySelector('.flowers-container');

// Toggle Edit Mode
toggleEditBtn.addEventListener('click', function() {
    editMode = !editMode;
    this.classList.toggle('active');

    if (editMode) {
        this.textContent = '✓ Editing...';
        exportBtn.style.display = 'block';
        flowerButtons.forEach(btn => {
            btn.classList.add('edit-mode');
        });
    } else {
        this.textContent = '🎨 Edit Mode';
        exportBtn.style.display = 'none';
        flowerButtons.forEach(btn => {
            btn.classList.remove('edit-mode');
        });
    }
});

// Drag functionality for flower buttons
flowerButtons.forEach(button => {
    // Mouse events
    button.addEventListener('mousedown', startDrag);

    // Touch events
    button.addEventListener('touchstart', startDrag, { passive: false });
});

function startDrag(e) {
    if (!editMode) return;

    e.preventDefault();
    draggedElement = this;
    draggedElement.classList.add('dragging');

    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    const rect = draggedElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    offsetX = touch.clientX - rect.left;
    offsetY = touch.clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', stopDrag);
}

function drag(e) {
    if (!draggedElement) return;

    e.preventDefault();
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const containerRect = container.getBoundingClientRect();

    // Calculate position relative to container
    let x = touch.clientX - containerRect.left - offsetX;
    let y = touch.clientY - containerRect.top - offsetY;

    // Convert to percentage
    let percentX = (x / containerRect.width) * 100;
    let percentY = (y / containerRect.height) * 100;

    // Constrain to container bounds
    percentX = Math.max(0, Math.min(95, percentX));
    percentY = Math.max(0, Math.min(95, percentY));

    draggedElement.style.left = percentX + '%';
    draggedElement.style.top = percentY + '%';
}

function stopDrag() {
    if (draggedElement) {
        draggedElement.classList.remove('dragging');
        draggedElement = null;
    }

    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
    document.removeEventListener('touchmove', drag);
    document.removeEventListener('touchend', stopDrag);
}

// Export positions and data
exportBtn.addEventListener('click', function() {
    const exportData = {
        positions: {},
        flowers: {}
    };

    flowerButtons.forEach(button => {
        const flower = button.getAttribute('data-flower');
        const displayName = button.querySelector('.btn-text').textContent;
        const top = button.style.top;
        const left = button.style.left;

        exportData.positions[flower] = { top, left };
        exportData.flowers[flower] = {
            name: flowerData[flower].name,
            displayName: displayName,
            description: flowerData[flower].description
        };
    });

    // Create downloadable file
    const exportText = JSON.stringify(exportData, null, 2);
    const blob = new Blob([exportText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flower-complete-data.json';
    a.click();
    URL.revokeObjectURL(url);

    // Also log to console for easy copying
    console.log('=== COMPLETE FLOWER DATA ===');
    console.log('Positions and descriptions saved!');
    console.log(JSON.stringify(exportData, null, 2));
    console.log('');
    console.log('=== HTML BUTTONS ===');
    flowerButtons.forEach(button => {
        const flower = button.getAttribute('data-flower');
        const name = button.querySelector('.btn-text').textContent;
        const top = button.style.top;
        const left = button.style.left;
        console.log(`<button class="flower-btn" data-flower="${flower}" style="top: ${top}; left: ${left};">`);
        console.log(`    <span class="btn-text">${name}</span>`);
        console.log(`</button>`);
        console.log('');
    });
    console.log('================================');

    alert('All data saved! Check:\n1. Downloaded file: flower-complete-data.json\n2. Browser console (F12) for complete data');
});

// ============ EDIT FLOWER DETAILS FUNCTIONALITY ============

const editFlowerModal = document.getElementById('editFlowerModal');
const editFlowerName = document.getElementById('editFlowerName');
const editFlowerDisplayName = document.getElementById('editFlowerDisplayName');
const editFlowerDescription = document.getElementById('editFlowerDescription');
const saveFlowerEditBtn = document.getElementById('saveFlowerEdit');
const closeEditModalBtn = document.getElementById('closeEditModal');

let currentEditingButton = null;
let currentEditingFlowerType = null;

// Open edit modal
function openEditModal(button, flowerType, flower) {
    currentEditingButton = button;
    currentEditingFlowerType = flowerType;

    editFlowerName.value = flower.name;
    editFlowerDisplayName.value = button.querySelector('.btn-text').textContent;
    editFlowerDescription.value = flower.description;

    editFlowerModal.style.display = 'block';
}

// Save flower edits
saveFlowerEditBtn.addEventListener('click', function() {
    if (currentEditingButton && currentEditingFlowerType) {
        // Update flowerData
        flowerData[currentEditingFlowerType].name = editFlowerName.value;
        flowerData[currentEditingFlowerType].description = editFlowerDescription.value;

        // Update button display name
        currentEditingButton.querySelector('.btn-text').textContent = editFlowerDisplayName.value;

        // Close modal
        editFlowerModal.style.display = 'none';

        // Show confirmation
        alert('Flower details updated! Click "💾 Save All" to export the changes.');
    }
});

// Close edit modal
closeEditModalBtn.addEventListener('click', function() {
    editFlowerModal.style.display = 'none';
});

// Close edit modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === editFlowerModal) {
        editFlowerModal.style.display = 'none';
    }
});
