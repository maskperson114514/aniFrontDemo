document.addEventListener('DOMContentLoaded', () => {
    // 搜索栏清空功能
    const searchInput = document.querySelector('.search-bar input[type="text"]');
    const clearBtn = document.querySelector('.search-bar .clear-btn');

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
            }
        });
    }

    // 胶囊栏弹出卡片功能
    const capsules = document.querySelectorAll('.capsule-bar .capsule');
    const popupCard = document.querySelector('.popup-card');
    const overlay = document.querySelector('.overlay'); // 获取遮罩层元素
    let isAnimating = false; // Add this flag to prevent rapid clicks

    // 占位函数：点击遮罩或关闭卡片时触发
    function placeholderFunction() {
        console.log('占位函数被触发！');
        // 在这里可以添加更多逻辑，例如重置筛选条件、发送分析事件等
    }

    capsules.forEach(capsule => {
        capsule.addEventListener('click', () => {
            if (popupCard && !isAnimating) { // Only proceed if not animating
                isAnimating = true; // Set flag to true when animation starts
                if (popupCard.classList.contains('show')) {
                    popupCard.classList.remove('show');
                    if (overlay) {
                        overlay.style.display = 'none'; // 隐藏遮罩
                    }
                    // When card hides, set its display to none after transition
                    popupCard.addEventListener('transitionend', function handler() {
                        popupCard.style.display = 'none';
                        isAnimating = false; // Reset flag after animation
                        popupCard.removeEventListener('transitionend', handler);
                    });
                } else {
                    popupCard.style.display = 'block'; // Show before starting animation
                    if (overlay) {
                        overlay.style.display = 'block'; // 显示遮罩
                    }
                    setTimeout(() => {
                        popupCard.classList.add('show');
                        // Set flag to false after animation ends for showing, too
                        popupCard.addEventListener('transitionend', function handler() {
                            isAnimating = false;
                            popupCard.removeEventListener('transitionend', handler);
                        });
                    }, 10); // Small delay to ensure display:block takes effect
                }
            }
        });
    });

    // 点击遮罩关闭卡片和遮罩，并触发占位函数
    if (overlay) {
        overlay.addEventListener('click', () => {
            if (popupCard && popupCard.classList.contains('show')) {
                popupCard.classList.remove('show');
                overlay.style.display = 'none';
                // 确保动画结束后再设置display:none，防止遮罩闪烁
                popupCard.addEventListener('transitionend', function handler() {
                    popupCard.style.display = 'none';
                    placeholderFunction(); // 触发占位函数
                    popupCard.removeEventListener('transitionend', handler);
                }, { once: true }); // 使用 once: true 确保事件只触发一次
            }
        });
    }

    // 页码导航功能
    const pagination = document.querySelector('.pagination');
    const pageLinks = pagination.querySelectorAll('.page-link');
    const prevLink = pagination.querySelector('.prev-link');
    const nextLink = pagination.querySelector('.next-link');

    let currentPage = 1; // 初始当前页为1
    const totalPages = 67; // 根据图片中的最后一页设置

    function updatePagination() {
        pageLinks.forEach(link => {
            link.classList.remove('active');
        });
        const currentPageLink = pagination.querySelector(`.page-link:not(.prev-link):not(.next-link):nth-child(${currentPage + 1})`);
        if (currentPageLink) {
            currentPageLink.classList.add('active');
        }

        // TODO: 如果需要动态生成页码，这里需要更复杂的逻辑
        // 目前只处理了硬编码的页码
    }

    // 初始更新页码状态
    updatePagination();

    // 前一页按钮点击事件
    if (prevLink) {
        prevLink.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePagination();
            }
        });
    }

    // 后一页按钮点击事件
    if (nextLink) {
        nextLink.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePagination();
            }
        });
    }

    // 页码按钮点击事件
    pageLinks.forEach(link => {
        if (!link.classList.contains('prev-link') && !link.classList.contains('next-link')) {
            link.addEventListener('click', (e) => {
                const pageNum = parseInt(e.target.textContent);
                if (!isNaN(pageNum)) {
                    currentPage = pageNum;
                    updatePagination();
                }
            });
        }
    });

    // 动态创建格子项
    const contentGrid = document.querySelector('.content-grid');
    if (contentGrid) {
        for (let i = 1; i <= 20; i++) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');

            const img = document.createElement('img');
            img.src = 'https://fpoimg.com/268x394';
            img.alt = '内容图片';

            const itemOverlay = document.createElement('div');
            itemOverlay.classList.add('item-overlay');

            const itemTitleDiv = document.createElement('div');
            itemTitleDiv.classList.add('item-title');

            const title = document.createElement('h4');
            title.textContent = `标题${i}`;

            itemTitleDiv.appendChild(title);
            gridItem.appendChild(img);
            gridItem.appendChild(itemOverlay);
            gridItem.appendChild(itemTitleDiv);
            contentGrid.appendChild(gridItem);
        }
    }

    // 处理搜索栏和胶囊栏的显示/隐藏
    const headerArea = document.querySelector('.header-area');
    const scrollableContent = document.querySelector('.scrollable-content');
    
    let lastScrollTop = 0; // 用于存储上次的滚动位置

    if (scrollableContent && headerArea && pagination) { // 添加 pagination 到条件中
        scrollableContent.addEventListener('scroll', () => {
            const currentScrollTop = scrollableContent.scrollTop;

            // 向下滚动时隐藏
            if (currentScrollTop > lastScrollTop && currentScrollTop > headerArea.offsetHeight) {
                if (!headerArea.classList.contains('hidden')) {
                    pagination.classList.remove('hidden'); // 同时显示 pagination
                    headerArea.classList.add('hidden');
                }
            } 
            // 向上滚动时显示，或者滚动到顶部时显示
            else if (currentScrollTop < lastScrollTop || currentScrollTop <= 0) {
                if (headerArea.classList.contains('hidden')) {
                    pagination.classList.add('hidden'); // 同时隐藏 pagination
                    headerArea.classList.remove('hidden');
                }
            }
            lastScrollTop = currentScrollTop; // 更新上次滚动位置
        });
    }
}); 