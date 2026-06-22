// ============================
// VERİ: Karakterler (artık HTML string'i içine gömülmüyor, obje olarak tutuluyor)
// ============================
let karakterler = [
    {
        id: "kyou",
        isim: "Kyou Nekozaki",
        emoji: "🐱",
        talimat: "Sen Kyou Nekozaki'sin. Tomboy tarzda, neşeli, sporu seven koridordaki yabancı lise kızısın.",
        gorsel: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop",
        aciklama: "Koridorda ilk kez karşılaştığınız tomboy lise kızı...",
        etiketler: ["Tomboy", "Lise"],
        sayac: "1.6M"
    },
    {
        id: "asuka",
        isim: "Tsundere Asuka",
        emoji: "🔥",
        talimat: "Sen tsundere Asuka'sın. Agresif ama tatlı bir tarz.",
        gorsel: "",
        aciklama: "Sürekli 'Baka!' diyen popüler üniversite öğrencisi.",
        etiketler: ["Romantik", "Tsundere"],
        sayac: "980K"
    }
];

let aktifKarakter = null;
let krediler = parseInt(localStorage.getItem("waifu_kredi")) || 5;

let secilenKarakterGorseliBase64 = "";
let secilenAuthAvatarBase64 = "";
let secilenYeniAvatarBase64 = "";

// ============================
// GÜVENLİ DOM OLUŞTURMA (innerHTML + kullanıcı verisi YOK)
// ============================
function kesfetKartiOlustur(karakter) {
    const kart = document.createElement("div");
    kart.className = "kesfet-kart";
    kart.addEventListener("click", () => sohbetOdasiAc(karakter));

    const resimAlani = document.createElement("div");
    resimAlani.className = "kart-resim-alan";

    if (karakter.gorsel) {
        const img = document.createElement("img");
        img.src = karakter.gorsel;
        img.alt = karakter.isim;
        resimAlani.appendChild(img);
    } else {
        const span = document.createElement("span");
        span.className = "emoji-avatar";
        span.textContent = karakter.emoji;
        resimAlani.appendChild(span);
    }

    const sayac = document.createElement("div");
    sayac.className = "sayac-etiket";
    sayac.textContent = "💬 " + karakter.sayac;
    resimAlani.appendChild(sayac);

    const bilgi = document.createElement("div");
    bilgi.className = "kart-bilgi";

    const isimEl = document.createElement("div");
    isimEl.className = "kart-isim";
    isimEl.textContent = karakter.isim;

    const aciklamaEl = document.createElement("div");
    aciklamaEl.className = "kart-aciklama";
    aciklamaEl.textContent = karakter.aciklama;

    const etiketlerEl = document.createElement("div");
    etiketlerEl.className = "kart-etiketler";
    karakter.etiketler.forEach(e => {
        const etiket = document.createElement("span");
        etiket.className = "etiket";
        etiket.textContent = e;
        etiketlerEl.appendChild(etiket);
    });

    bilgi.append(isimEl, aciklamaEl, etiketlerEl);
    kart.append(resimAlani, bilgi);
    return kart;
}

function sohbetSatiriOlustur(karakter) {
    const satir = document.createElement("div");
    satir.className = "sohbet-satir";
    satir.addEventListener("click", () => sohbetOdasiAc(karakter));

    const avatar = document.createElement("div");
    avatar.className = "sohbet-avatar";
    if (karakter.gorsel) {
        const img = document.createElement("img");
        img.src = karakter.gorsel;
        img.alt = karakter.isim;
        avatar.appendChild(img);
    } else {
        avatar.textContent = karakter.emoji;
    }

    const detay = document.createElement("div");
    detay.className = "sohbet-detay";

    const ustSatir = document.createElement("div");
    ustSatir.className = "sohbet-ust-satir";
    const isimEl = document.createElement("span");
    isimEl.className = "sohbet-isim";
    isimEl.textContent = karakter.isim;
    const zamanEl = document.createElement("span");
    zamanEl.className = "sohbet-zaman";
    zamanEl.textContent = "Şimdi";
    ustSatir.append(isimEl, zamanEl);

    const sonMesaj = document.createElement("div");
    sonMesaj.className = "sohbet-son-mesaj";
    sonMesaj.textContent = "Sohbet odama hoş geldin! Arka planımdaki resmim...";

    detay.append(ustSatir, sonMesaj);
    satir.append(avatar, detay);
    return satir;
}

function listeleriYenidenCiz() {
    const kesfetGrid = document.getElementById("kesfet-grid");
    const sohbetListesi = document.getElementById("ana-sohbet-listesi");
    kesfetGrid.innerHTML = "";
    sohbetListesi.innerHTML = "";
    karakterler.forEach(k => {
        kesfetGrid.appendChild(kesfetKartiOlustur(k));
        sohbetListesi.appendChild(sohbetSatiriOlustur(k));
    });
}

// ============================
// SEKME GEÇİŞİ
// ============================
function sekmeDegistir(sekmeAdi, element) {
    document.querySelectorAll('.ana-icerik').forEach(el => el.classList.remove('active-pane'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.getElementById('pane-' + sekmeAdi).classList.add('active-pane');
    element.classList.add('active');
}

// ============================
// SOHBET ODASI
// ============================
function sohbetOdasiAc(karakter) {
    aktifKarakter = karakter;
    document.getElementById("sohbet-penceresi").style.display = "flex";
    document.getElementById("pencere-unvan").textContent = karakter.emoji + " " + karakter.isim;

    const arkaPlan = document.getElementById("sohbet-arka-gorsel");
    if (karakter.gorsel) {
        arkaPlan.style.backgroundImage = `url('${karakter.gorsel}')`;
        arkaPlan.textContent = "";
    } else {
        arkaPlan.style.backgroundImage = "none";
        arkaPlan.textContent = karakter.emoji;
    }

    const kutu = document.getElementById("pencere-mesaj-kutusu");
    kutu.innerHTML = "";
    mesajBalonuEkle("bot", `Selam! Ben ${karakter.isim}. Sohbet odama hoş geldin! Arka planımdaki resmim nasıl duruyor? 😉`);
}

function sohbetOdasiKapat() {
    document.getElementById("sohbet-penceresi").style.display = "none";
}

function mesajBalonuEkle(kim, metin) {
    const kutu = document.getElementById("pencere-mesaj-kutusu");
    const balon = document.createElement("div");
    balon.className = "balon " + (kim === "user" ? "b-user" : "b-bot");
    balon.textContent = metin;
    kutu.appendChild(balon);
    kutu.scrollTop = kutu.scrollHeight;
    return balon;
}

async function pencereMesajGonder() {
    if (krediler <= 0) {
        document.getElementById("reklam-modal").style.display = "flex";
        return;
    }

    const girdi = document.getElementById("pencere-girdi-metin");
    const metin = girdi.value.trim();
    if (!metin) return;

    girdi.value = "";
    krediGuncelle(-1);

    mesajBalonuEkle("user", metin);
    const yukleniyorBalonu = mesajBalonuEkle("bot", "Cevap yazılıyor...");

    try {
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                systemTalimat: aktifKarakter.talimat,
                kullaniciMesaji: metin
            })
        });

        const data = await response.json();

        if (!response.ok) {
            yukleniyorBalonu.textContent = "Hata: " + (data.error || "Bilinmeyen hata");
            return;
        }

        yukleniyorBalonu.textContent = data.text || "Yapay zeka boş bir yanıt döndürdü.";
    } catch (error) {
        yukleniyorBalonu.textContent = "Bağlantı hatası: " + error.message;
    }
}

// ============================
// KREDİ SİSTEMİ
// ============================
function krediGuncelle(miktar) {
    krediler += miktar;
    localStorage.setItem("waifu_kredi", krediler);
    document.getElementById("kredi-sayac").textContent = krediler;
}

function reklamIzle() {
    krediGuncelle(5);
    document.getElementById("reklam-modal").style.display = "none";
}

// ============================
// DOSYA SEÇİMİ
// ============================
function dosyaSecildi(input, etiketId) {
    const dosya = input.files[0];
    if (!dosya) return;

    document.getElementById(etiketId).textContent = dosya.name;

    const reader = new FileReader();
    reader.onload = function (e) {
        if (input.id === "yeni-gorsel-dosya") secilenKarakterGorseliBase64 = e.target.result;
        if (input.id === "auth-avatar-dosya") secilenAuthAvatarBase64 = e.target.result;
        if (input.id === "profil-yeni-avatar-dosya") secilenYeniAvatarBase64 = e.target.result;
    };
    reader.readAsDataURL(dosya);
}

// ============================
// AUTH (giriş/çıkış)
// ============================
function hesapAc() {
    const email = document.getElementById("auth-email").value.trim().toLowerCase();
    const sifre = document.getElementById("auth-sifre").value.trim();

    if (!email || !sifre) {
        return alert("Lütfen e-posta & şifre alanlarını boş bırakmayın!");
    }

    const gmailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        return alert("Hatalı Giriş! Sadece geçerli bir gerçek '@gmail.com' adresi ile kayıt olabilirsiniz.");
    }

    localStorage.setItem("waifu_user", email);
    localStorage.setItem("waifu_avatar", secilenAuthAvatarBase64);

    oturumAc(email, secilenAuthAvatarBase64);
    alert("Başarıyla giriş yapıldı!");
}

function oturumAc(email, avatarUrlOrBase64) {
    document.getElementById("auth-kutusu").style.display = "none";
    document.getElementById("profil-kutusu").style.display = "block";
    document.getElementById("profil-mail").textContent = email;
    document.getElementById("profil-kullanici-adi").textContent = email.split('@')[0];

    avatarGorseliniAyarla(avatarUrlOrBase64);
}

function avatarGorseliniAyarla(urlOrBase64) {
    const kutu = document.getElementById("profil-avatar-kutusu");
    kutu.innerHTML = "";
    if (urlOrBase64 && urlOrBase64.trim() !== "") {
        const img = document.createElement("img");
        img.src = urlOrBase64;
        img.alt = "Profil";
        kutu.appendChild(img);
    } else {
        kutu.textContent = "👑";
    }
}

function profilResmiGuncelle() {
    if (!secilenYeniAvatarBase64) return alert("Lütfen önce galeriden bir görsel seçin!");

    localStorage.setItem("waifu_avatar", secilenYeniAvatarBase64);
    avatarGorseliniAyarla(secilenYeniAvatarBase64);
    alert("Profil fotoğrafınız başarıyla güncellendi!");
    document.getElementById("profil-yeni-avatar-etiket").textContent = "Seçilmedi";
    secilenYeniAvatarBase64 = "";
}

function cikisYap() {
    localStorage.removeItem("waifu_user");
    localStorage.removeItem("waifu_avatar");
    document.getElementById("auth-kutusu").style.display = "block";
    document.getElementById("profil-kutusu").style.display = "none";
    document.getElementById("auth-avatar-etiket").textContent = "Görsel seçilmedi";
    secilenAuthAvatarBase64 = "";
    alert("Hesaptan çıkış yapıldı.");
}

function istekGonder() {
    const istek = document.getElementById("istek-metin").value.trim();
    if (!istek) return alert("Lütfen bir istek yazın!");
    alert("İsteğiniz başarıyla iletildi!");
    document.getElementById("istek-metin").value = "";
}

// ============================
// YENİ KARAKTER EKLEME
// ============================
function yeniKarakterEkle() {
    const isim = document.getElementById("yeni-isim").value.trim();
    const talimat = document.getElementById("yeni-talimat").value.trim();

    if (!isim || !talimat) return alert("Lütfen isim ve talimat alanlarını boş bırakmayın!");

    const yeniKarakter = {
        id: "ozel-" + Date.now(),
        isim: isim,
        emoji: "✨",
        talimat: talimat,
        gorsel: secilenKarakterGorseliBase64,
        aciklama: talimat,
        etiketler: ["Özel"],
        sayac: "0"
    };

    karakterler.push(yeniKarakter);
    listeleriYenidenCiz();

    alert(`${isim} başarıyla oluşturuldu! Keşfet sekmesine ve sohbetler listesine eklendi.`);
    document.getElementById("yeni-isim").value = "";
    document.getElementById("yeni-talimat").value = "";
    document.getElementById("yeni-gorsel-etiket").textContent = "Görsel seçilmedi";
    secilenKarakterGorseliBase64 = "";

    sekmeDegistir('kesfet', document.querySelector('.nav-link[data-sekme="kesfet"]'));
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    document.querySelector('.nav-link[data-sekme="kesfet"]').classList.add('active');
}

// ============================
// BAŞLANGIÇ - olay dinleyicileri bağla
// ============================
window.addEventListener("DOMContentLoaded", () => {
    document.getElementById("kredi-sayac").textContent = krediler;

    listeleriYenidenCiz();

    const kayitliKullanici = localStorage.getItem("waifu_user");
    if (kayitliKullanici) {
        const kayitliAvatar = localStorage.getItem("waifu_avatar") || "";
        oturumAc(kayitliKullanici, kayitliAvatar);
    }

    document.querySelectorAll('.nav-link').forEach(btn => {
        btn.addEventListener("click", () => sekmeDegistir(btn.dataset.sekme, btn));
    });

    document.getElementById("yeni-gorsel-dosya").addEventListener("change", e => dosyaSecildi(e.target, "yeni-gorsel-etiket"));
    document.getElementById("auth-avatar-dosya").addEventListener("change", e => dosyaSecildi(e.target, "auth-avatar-etiket"));
    document.getElementById("profil-yeni-avatar-dosya").addEventListener("change", e => dosyaSecildi(e.target, "profil-yeni-avatar-etiket"));

    document.getElementById("btn-karakter-ekle").addEventListener("click", yeniKarakterEkle);
    document.getElementById("btn-giris").addEventListener("click", hesapAc);
    document.getElementById("btn-profil-resmi-guncelle").addEventListener("click", profilResmiGuncelle);
    document.getElementById("btn-cikis").addEventListener("click", cikisYap);
    document.getElementById("btn-istek-gonder").addEventListener("click", istekGonder);
    document.getElementById("btn-pencere-kapat").addEventListener("click", sohbetOdasiKapat);
    document.getElementById("btn-pencere-gonder").addEventListener("click", pencereMesajGonder);
    document.getElementById("btn-reklam-izle").addEventListener("click", reklamIzle);

    document.getElementById("pencere-girdi-metin").addEventListener("keypress", e => {
        if (e.key === "Enter") pencereMesajGonder();
    });

    document.querySelectorAll(".btn-satin-al").forEach(btn => {
        btn.addEventListener("click", () => {
            alert(btn.dataset.plan + " planı satın alım sayfasına yönlendiriliyorsunuz...");
        });
    });
});
