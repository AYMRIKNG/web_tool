var hotList = 0;

$(function() {
    // Lorsqu'une touche est relâchée dans le champ de recherche
    $('#search-text').keyup(function() {
        var keywords = $(this).val();  // Récupérer la valeur du champ de recherche
        if (keywords == '') { 
            $('#word').hide();  // Cacher la liste si aucun mot-clé
            return;
        }

        // Appel AJAX à l'API Google Suggest
        $.ajax({
            url: 'https://suggestqueries.google.com/complete/search?client=firefox&callback=?',  // URL de l'API Google Suggest
            dataType: 'jsonp',  // Utilisation du format JSONP
            jsonp: 'callback',  // Le paramètre de callback attendu par l'API
            data: {
                q: keywords,  // Mot-clé pour lequel on souhaite des suggestions
                hl: 'fr',  // Langue des résultats
                gl: 'fr',  // Région (France)
                lr: 'lang_fr'
            },
            success: function(res) {
                $('#word').empty().show();  // Vider la liste existante et la rendre visible
                hotList = res[1].length;  // Nombre de suggestions retournées
                if (hotList) {
                    $("#word").css("display", "block");  // Afficher la liste des suggestions
                    for (var i = 0; i < hotList; i++) {
                        // Ajouter chaque suggestion à la liste
                        $("#word").append("<li><span>" + res[1][i] + "</span></li>");

                        // Ajouter un événement au clic sur chaque suggestion
                        $("#word li").eq(i).click(function() {
                            $('#search-text').val($(this).text());  // Mettre la suggestion dans le champ de recherche
                            $('#word').css('display', 'none');  // Cacher la liste des suggestions
                            $('.submit').trigger('click');  // Soumettre le formulaire ou effectuer la recherche
                        });

                        // Ajouter des styles spécifiques aux premières suggestions
                        if (i === 0) {
                            $("#word ul li").eq(i).css({
                                "border-top": "none"
                            });
                            $("#word ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#f54545"
                            });
                        } else if (i === 1) {
                            $("#word ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#ff8547"
                            });
                        } else if (i === 2) {
                            $("#word ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#ffac38"
                            });
                        }
                    }
                } else {
                    $("#word").css("display", "none");  // Cacher la liste si aucune suggestion
                }
            },
            error: function() {
                $('#word').empty().show();
                $('#word').hide();  // Cacher la liste en cas d'erreur
            }
        });
    });

    // Lorsqu'un élément de la liste de suggestions est cliqué
    $(document).on('click', '#word li', function() {
        var word = $(this).text();  // Récupérer le texte de la suggestion
        $('#search-text').val(word);  // Remplir le champ de recherche avec la suggestion
        $('#word').empty();  // Vider la liste
        $('#word').hide();   // Cacher la liste
        $('.submit').trigger('click');  // Soumettre le formulaire ou déclencher l'événement de recherche
    });

    // Cacher la liste de suggestions lorsqu'on clique en dehors
    $(document).on('click', '.io-grey-mode', function() {
        $('#word').empty();  // Vider la liste
        $('#word').hide();   // Cacher la liste
    });
});
