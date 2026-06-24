Dijital Oda v5

Bu sürümde tıklama sorunu düzeltildi.

Önceki sürümde tarayıcı file:// güvenliği nedeniyle canvas piksel okumasını engelleyebiliyordu.
Bu sürümde canvas kullanılmaz; alpha-mask verileri hitmasks.js içine gömülüdür.
Bu yüzden index.html dosyasını çift tıklayarak açsan bile tıklamalar çalışır.

Kullanım:
1. ZIP dosyasını tamamen çıkart.
2. index.html dosyasını aç.
3. Nesnenin üzerine gelince parlama görünmeli.
4. Tıklayınca konuşma balonu açılmalı.
5. D tuşuna basarsan maskeleri kontrol amaçlı görünür/gizli yapabilirsin.

Metinleri değiştirmek için script.js içindeki hotspots listesindeki text alanlarını düzenle.

- Oltanın tıklanılabilir alanı kaldırıldı.
- Tenis raketinin solundaki asılı yapraklar kaldırılarak yerine gerçekçi balık eklendi.
- Balık için oltadaki yazılarla yeni tıklanılabilir alan oluşturuldu.

- Sol üste "Etkileşimli Nesneler 0/8" sayacı eklendi.
- İlk kez açılan her nesnede sayaç 1 artar.
- Sayaç yanına ampul butonu eklendi.
- Ampul açıkken tüm nesnelerin yerleri mavi parlamayla gösterilir, tekrar basınca kapanır.

- Tablonun altına / şöminenin solundaki duvara Beşiktaş forması eklendi.
- Formaya tıklayınca Şenol Güneş alıntısı görünür.
- Bilgi balonları küçültülüp daha premium görünüme çekildi.
- Mouse wheel ile zoom, yön tuşları ile gezinme eklendi.

- Forma artık arka planın içine doğal olarak işlenmiştir; görsel için yerel patch uygulandı ve hitmask yeniden çıkarıldı.

- Forma hover parlaması düzeltildi: forma görüntüsü mavi/beyaz patlamıyor, sadece dış glow görünüyor.

- Forma hover düzeltildi: cutout artık sadece mavi dış kontur; hitmask tam forma alanı olarak kaldı.
