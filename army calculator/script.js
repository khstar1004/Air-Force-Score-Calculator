document.addEventListener('DOMContentLoaded', function() {
    const generalButton = document.getElementById('generalButton');
    const specializedButton = document.getElementById('specializedButton');
    const transportGroup = document.getElementById('transportGroup');
    const majorGroup = document.getElementById('majorGroup');
    const certificateButtonsContainer = document.getElementById('certificateButtons');

    let selectedField = 'general';
    let isTransport = false;
    let selectedCertificate = null;

    const generalCertificates = [
        { value: 70, label: '기사 이상', tooltip: '국가기술자격증: 기사 이상' },
        { value: 68, label: '산업기사', tooltip: '국가기술자격증: 산업기사' },
        { value: 66, label: '기능사', tooltip: '국가기술자격증: 기능사' },
        { value: 70, label: '일학습병행 L6, L5', tooltip: '일학습병행 자격증: L6, L5' },
        { value: 68, label: '일학습병행 L4, L3', tooltip: '일학습병행 자격증: L4, L3' },
        { value: 66, label: '일학습병행 L2', tooltip: '일학습병행 자격증: L2' },
        { value: 64, label: '일반자격증 (공인)', tooltip: '일반자격증(공인): 워드프로세서, 컴퓨터활용능력 등' },
        { value: 62, label: '일반자격증 (비공인)', tooltip: '일반자격증(비공인): 민간자격증 등' },
        { value: 60, label: '미소지', tooltip: '자격증이 없습니다' },
    ];

    const specializedCertificates = [
        { value: 50, label: '기사 이상', tooltip: '국가기술자격증: 기사 이상', isNonTransport: true },
        { value: 45, label: '산업기사', tooltip: '국가기술자격증: 산업기사', isNonTransport: true },
        { value: 40, label: '기능사', tooltip: '국가기술자격증: 기능사', isNonTransport: true },
        { value: 50, label: '일학습병행 L6, L5', tooltip: '일학습병행 자격증: L6, L5', isNonTransport: true },
        { value: 45, label: '일학습병행 L4, L3', tooltip: '일학습병행 자격증: L4, L3', isNonTransport: true },
        { value: 40, label: '일학습병행 L2', tooltip: '일학습병행 자격증: L2', isNonTransport: true },
        { value: 30, label: '일반자격증 (공인)', tooltip: '일반자격증(공인): 워드프로세서, 컴퓨터활용능력 등', isNonTransport: true },
        { value: 26, label: '일반자격증 (비공인)', tooltip: '일반자격증(비공인): 민간자격증 등', isNonTransport: true },
        { value: 20, label: '자격증 미소지', tooltip: '자격증이 없습니다' },
        { value: 50, label: '대형/특수 면허', tooltip: '운전면허증: 대형/특수 면허', isTransport: true },
        { value: 45, label: '1종 보통', tooltip: '운전면허증: 1종 보통', isTransport: true },
        { value: 40, label: '2종 보통(수동)', tooltip: '운전면허증: 2종 보통(수동)', isTransport: true },
    ];

    const cutoffData = {
        "일반기술": {
            "일반": [84.0, 87.0, 91.0, 95.0, 97.0, 97.0, 95.0, 95.0, 95.0, 95.0, 95.0, 96.0],
            "전자계산": [77.0, 86.0, 88.0, 93.0, 96.0, 95.0, 85.0, 93.0, 91.0, 92.0, 92.0, 93.0],
            "화생방": [53.0, 66.0, 78.0, 74.0, 76.0, 76.0, 76.0, 75.0, 75.0, 75.0, 74.0, 85.0],
            "의무": [102.0, 88.0, 82.0, 91.0, 97.0, 105.0, 111.0, 111.0, 109.0, 109.0, 113.0, 113.0]
        },
        "전문기술": {
            "기계": [46.0, 46.0, 59.0, 67.0, 74.0, 71.0, 69.0, 64.0, 69.0, 66.0, 62.0, 69.0],
            "통신전자": [81.0, 84.0, 86.0, 88.0, 89.0, 91.0, 89.0, 88.0, 87.0, 88.0, 90.0, 91.0],
            "전기": [53.0, 52.0, 53.0, 54.0, 62.0, 70.0, 57.0, 56.0, 70.0, 63.0, 55.0, 63.0],
            "차량정비": [66.0, 67.0, 74.0, 79.0, 83.0, 72.0, 70.0, 71.0, 70.0, 71.0, 67.0, 81.0]
        }
    };

    const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

    generalButton.addEventListener('click', () => setField('general'));
    specializedButton.addEventListener('click', () => setField('specialized'));

    document.getElementsByName('transport').forEach(radio => {
        radio.addEventListener('change', function() {
            isTransport = this.value === 'yes';
            createCertificateButtons(specializedCertificates);
        });
    });

    createCertificateButtons(generalCertificates);

    document.getElementById('scoreForm').addEventListener('submit', calculateScore);

    function setField(field) {
        selectedField = field;
        generalButton.classList.toggle('active', field === 'general');
        specializedButton.classList.toggle('active', field === 'specialized');
        majorGroup.style.display = field === 'specialized' ? 'block' : 'none';
        transportGroup.style.display = field === 'specialized' ? 'block' : 'none';
        createCertificateButtons(field === 'general' ? generalCertificates : specializedCertificates);
    }

    function createCertificateButtons(certificates) {
        certificateButtonsContainer.innerHTML = '';
        selectedCertificate = null;
        certificates.forEach(cert => {
            if ((!isTransport && cert.isTransport) || (isTransport && cert.isNonTransport)) return;
            const button = document.createElement('button');
            button.type = 'button';
            button.dataset.value = cert.value;
            button.dataset.tooltip = cert.tooltip;
            button.textContent = cert.label;
            button.addEventListener('click', () => selectCertificate(button));
            certificateButtonsContainer.appendChild(button);
        });
    }

    function selectCertificate(button) {
        certificateButtonsContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedCertificate = parseInt(button.dataset.value);
    }

    function calculateScore(e) {
        e.preventDefault();
        let totalScore = 0;
        let certificateScore = selectedCertificate || 0;
        let majorScore = 0;
        let attendanceScore = 0;
        let bonusScore = 0;

        totalScore += certificateScore;

        if (selectedField === 'specialized') {
            majorScore = isTransport ? 20 : parseInt(document.getElementById('major').value);
            totalScore += majorScore;
        }

        const totalAbsenceDays = calculateAbsenceDays();
        attendanceScore = calculateAttendanceScore(totalAbsenceDays);
        totalScore += attendanceScore;

        bonusScore = calculateBonusScore();
        totalScore += bonusScore;

        displayResults(totalScore, certificateScore, majorScore, attendanceScore, bonusScore);
        const recommendations = checkCutoffScores(totalScore, selectedField);
        displayRecommendations(recommendations);
    }

    function calculateAbsenceDays() {
        const absenceDays = parseInt(document.getElementById('absenceDays').value);
        const lateDays = parseInt(document.getElementById('lateDays').value);
        const leaveDays = parseInt(document.getElementById('leaveDays').value);
        return absenceDays + Math.floor(lateDays / 2) + Math.floor(leaveDays / 4);
    }

    function calculateAttendanceScore(totalAbsenceDays) {
        if (selectedField === 'general') {
            if (totalAbsenceDays === 0) return 20;
            if (totalAbsenceDays <= 2) return 19;
            if (totalAbsenceDays <= 4) return 18;
            if (totalAbsenceDays <= 6) return 17;
            return 16;
        } else {
            if (totalAbsenceDays === 0) return 10;
            if (totalAbsenceDays <= 2) return 9;
            if (totalAbsenceDays <= 4) return 8;
            if (totalAbsenceDays <= 6) return 7;
            return 6;
        }
    }

    function calculateBonusScore() {
        let score = 0;
        const volunteerHours = parseInt(document.getElementById('volunteerHours').value);
        const bloodDonations = parseInt(document.getElementById('bloodDonations').value);

        score += calculateVolunteerPoints(volunteerHours);
        score += Math.min(bloodDonations, 8);

        if (document.getElementById('veteran').checked) score += 4;
        if (document.getElementById('multiChild3').checked) score += 4;
        else if (document.getElementById('multiChild2').checked) score += 2;
        if (document.getElementById('koreanHistory1').checked) score += 2;
        else if (document.getElementById('koreanHistory2').checked) score += 1;
        if (document.getElementById('koreanLanguage1').checked) score += 2;
        else if (document.getElementById('koreanLanguage2').checked) score += 1;
        if (document.getElementById('englishScore1').checked) score += 2;
        else if (document.getElementById('englishScore2').checked) score += 1;
        if (document.getElementById('militaryCareerDesign').checked) score += 1;

        return Math.min(score, 15);
    }

    function calculateVolunteerPoints(hours) {
        if (hours >= 64) return 8;
        if (hours >= 56) return 7;
        if (hours >= 48) return 6;
        if (hours >= 40) return 5;
        if (hours >= 32) return 4;
        if (hours >= 24) return 3;
        if (hours >= 16) return 2;
        if (hours >= 8) return 1;
        return 0;
    }

    function displayResults(totalScore, certificateScore, majorScore, attendanceScore, bonusScore) {
        document.getElementById('totalScore').textContent = totalScore;
        document.getElementById('certificateScore').textContent = certificateScore;
        document.getElementById('majorScoreDisplay').style.display = selectedField === 'specialized' ? 'block' : 'none';
        document.getElementById('majorScore').textContent = majorScore;
        document.getElementById('attendanceScore').textContent = attendanceScore;
        document.getElementById('bonusScore').textContent = bonusScore;
        document.getElementById('result').classList.remove('hidden');
    }

    function checkCutoffScores(score, field) {
        const recommendations = [];
        const fieldData = field === 'general' ? cutoffData['일반기술'] : cutoffData['전문기술'];

        for (const [position, cutoffs] of Object.entries(fieldData)) {
            cutoffs.forEach((cutoff, index) => {
                if (score >= cutoff) {
                    recommendations.push({ position, month: months[index], cutoff, chance: "높음" });
                } else if (score >= cutoff - 5) {
                    recommendations.push({ position, month: months[index], cutoff, chance: "보통" });
                } else if (score >= cutoff - 10) {
                    recommendations.push({ position, month: months[index], cutoff, chance: "낮음" });
                }
            });
        }

        return recommendations.sort((a, b) => b.cutoff - a.cutoff);
    }

    function displayRecommendations(recommendations) {
        const container = document.createElement('div');
        container.innerHTML = '<h3>지원 가능한 직종 및 월 추천:</h3>';

        if (recommendations.length === 0) {
            container.innerHTML += '<p>현재 점수로는 지원 가능한 직종이 없습니다. 점수를 더 높이는 것을 고려해보세요.</p>';
        } else {
            const table = document.createElement('table');
            const thead = document.createElement('thead');
            const tbody = document.createElement('tbody');

            // 테이블 헤더 생성
            thead.innerHTML = `
                <tr>
                    <th>직종</th>
                    <th>월</th>
                    <th>커트라인</th>
                    <th>합격 가능성</th>
                </tr>
            `;
            table.appendChild(thead);

            // 테이블 본문 생성
            recommendations.forEach(rec => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rec.position}</td>
                    <td>${rec.month}</td>
                    <td>${rec.cutoff}점</td>
                    <td class="chance-${rec.chance}">${rec.chance}</td>
                `;
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            container.appendChild(table);
        }

        const existingRecommendations = document.getElementById('recommendations');
        if (existingRecommendations) {
            existingRecommendations.remove();
        }

        container.id = 'recommendations';
        document.getElementById('result').appendChild(container);
    }
});